import { api, setStoredToken } from './createApiClient';

export async function exampleLogin(): Promise<void> {
  const response = await api.login('supersecret');

  setStoredToken(response.token);
}

export async function exampleDashboard(): Promise<void> {
  const dashboard = await api.dashboard();

  console.log(dashboard.businessSnapshot);
}

export async function exampleCreateInventoryFlow(): Promise<void> {
  const item = await api.createItem({
    title: 'LEGO Ninjago Example',
    setNumber: '71800',
    theme: 'Ninjago',
    kind: 'set',
  });

  const inventory = await api.createInventoryItem({
    itemId: item.id,
    titleSnapshot: item.title,
    purchasePrice: 1000,
    totalCost: 1100,
    quantity: 1,
    condition: 'used',
    sealed: false,
    expectedSalePriceManual: 1700,
  });

  const decision = await api.evaluateInventory({
    inventoryItemId: inventory.id,
    targetRoiPercent: 35,
  });

  console.log(decision.action, decision.score);
}

export async function exampleSaleReturnFlow(): Promise<void> {
  const inventory = (await api.inventory({ limit: 1 }))[0];

  if (!inventory) {
    throw new Error('No inventory item found');
  }

  const order = await api.createOrder({
    inventoryItemId: inventory.id,
    productTitle: inventory.titleSnapshot,
    buyerName: 'Example buyer',
    contact: '+380000000000',
    sellPrice: 1700,
    quantity: 1,
    channel: 'frontend-example',
  });

  const completed = await api.completeOrderAsSale(order.id);

  if (!completed.saleId) {
    throw new Error('Order did not produce saleId');
  }

  const returnRequest = await api.createReturn({
    saleId: completed.saleId,
    orderId: completed.id,
    reason: 'Frontend example return',
    refundAmount: 1700,
    restock: true,
    quantity: 1,
  });

  await api.approveReturn(returnRequest.id);
  await api.resolveReturn(returnRequest.id);
}