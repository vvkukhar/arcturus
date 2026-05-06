import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { strictValidationPipe } from '../src/common/strict-validation.pipe';
import { authRequest, login, uniqueSetNumber } from './e2e-test-utils';

describe('Arcturus API E2E', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.setGlobalPrefix('api');
    app.useGlobalPipes(strictValidationPipe);

    await app.init();

    token = await login(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('loads health endpoint', async () => {
    const response = await request(app.getHttpServer()).get('/api/health');

    expect([200, 201]).toContain(response.status);
    expect(response.body).toBeTruthy();
  });

  it('runs core business loop', async () => {
    const itemResponse = await authRequest(app, token)
      .post('/api/items')
      .send({
        title: `E2E LEGO Ninjago ${Date.now()}`,
        setNumber: uniqueSetNumber(),
        theme: 'Ninjago',
        kind: 'set',
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const item = itemResponse.body;
    expect(item.id).toBeTruthy();

    const warehousesResponse = await authRequest(app, token)
      .get('/api/warehouse')
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    let warehouse = warehousesResponse.body[0];

    if (!warehouse) {
      const createdWarehouseResponse = await authRequest(app, token)
        .post('/api/warehouse')
        .send({
          code: `E2E-${Date.now()}`,
          name: 'E2E Warehouse',
          address: 'Test address',
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      warehouse = createdWarehouseResponse.body;
    }

    const locationsResponse = await authRequest(app, token)
      .get(`/api/warehouse/locations?warehouseId=${warehouse.id}`)
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    let location = locationsResponse.body[0];

    if (!location) {
      const createdLocationResponse = await authRequest(app, token)
        .post('/api/warehouse/locations')
        .send({
          warehouseId: warehouse.id,
          code: `E2E-LOC-${Date.now()}`,
          name: 'E2E Location',
          zone: 'A',
          shelf: '1',
          box: '1',
        })
        .expect((res) => {
          expect([200, 201]).toContain(res.status);
        });

      location = createdLocationResponse.body;
    }

    const inventoryResponse = await authRequest(app, token)
      .post('/api/inventory')
      .send({
        itemId: item.id,
        titleSnapshot: item.title,
        purchasePrice: 1000,
        totalCost: 1100,
        quantity: 2,
        condition: 'used',
        sealed: false,
        expectedSalePriceManual: 1700,
        storageLocationId: location.id,
        warehouseId: warehouse.id,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const inventory = inventoryResponse.body;
    expect(inventory.id).toBeTruthy();

    const inventoryDecisionResponse = await authRequest(app, token)
      .post('/api/decision-engine/inventory')
      .send({
        inventoryItemId: inventory.id,
        targetRoiPercent: 35,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(inventoryDecisionResponse.body.id).toBeTruthy();

    const buyDecisionResponse = await authRequest(app, token)
      .post('/api/decision-engine/buy')
      .send({
        itemId: item.id,
        buyPrice: 900,
        shippingPrice: 80,
        targetSellPrice: 1700,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(buyDecisionResponse.body.id).toBeTruthy();

    const financeResponse = await authRequest(app, token)
      .get(`/api/finance/item/${item.id}`)
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(financeResponse.body.itemId).toEqual(item.id);

    const orderResponse = await authRequest(app, token)
      .post('/api/orders')
      .send({
        inventoryItemId: inventory.id,
        productTitle: inventory.titleSnapshot,
        buyerName: 'E2E Buyer',
        contact: '+380000000000',
        sellPrice: 1700,
        quantity: 1,
        channel: 'e2e',
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const order = orderResponse.body;
    expect(order.id).toBeTruthy();

    const completedOrderResponse = await authRequest(app, token)
      .patch('/api/orders/complete-as-sale')
      .send({
        id: order.id,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const completedOrder = completedOrderResponse.body;
    expect(completedOrder.saleId).toBeTruthy();

    const expenseResponse = await authRequest(app, token)
      .post('/api/expenses')
      .send({
        type: 'sales',
        category: 'packaging',
        amount: 35,
        saleId: completedOrder.saleId,
        orderId: completedOrder.id,
        inventoryItemId: inventory.id,
        description: 'E2E packaging expense',
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(expenseResponse.body.id).toBeTruthy();

    const returnResponse = await authRequest(app, token)
      .post('/api/returns')
      .send({
        saleId: completedOrder.saleId,
        orderId: completedOrder.id,
        reason: 'E2E return test',
        refundAmount: 1700,
        restock: true,
        quantity: 1,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const returnRequest = returnResponse.body;
    expect(returnRequest.id).toBeTruthy();

    await authRequest(app, token)
      .patch('/api/returns/approve')
      .send({
        id: returnRequest.id,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    await authRequest(app, token)
      .patch('/api/returns/resolve')
      .send({
        id: returnRequest.id,
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    const pnlResponse = await authRequest(app, token)
      .get('/api/reports/pnl')
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(pnlResponse.body.profit).toBeTruthy();

    const dashboardResponse = await authRequest(app, token)
      .get('/api/dashboard')
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(dashboardResponse.body.businessSnapshot).toBeTruthy();

    const backupResponse = await authRequest(app, token)
      .post('/api/backup')
      .send({
        type: 'e2e',
        notes: 'E2E backup test',
      })
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(backupResponse.body.id).toBeTruthy();

    const exportResponse = await authRequest(app, token)
      .get('/api/import-export/export/inventory.csv')
      .expect((res) => {
        expect([200, 201]).toContain(res.status);
      });

    expect(typeof exportResponse.text).toBe('string');
  });
});