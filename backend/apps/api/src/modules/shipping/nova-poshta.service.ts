// call:function_1{"queries":["backend/apps/api/src/modules/shipping/nova-poshta.service.ts"]}
import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class NovaPoshtaService {
  private readonly logger = new Logger(NovaPoshtaService.name);
  private readonly apiKey = process.env.NOVA_POSHTA_API_KEY;
  private readonly apiUrl = 'https://api.novaposhta.ua/v2.0/json/';

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  // 🔥 Хелпер для зручних запитів до АПІ НП
  private async npRequest(model: string, method: string, props: any = {}) {
    const res = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: this.apiKey,
        modelName: model,
        calledMethod: method,
        methodProperties: props
      })
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.errors.join(', '));
    return data.data;
  }

  async createExpressWaybill(params: {
    orderId: string;
    firstName: string;
    lastName: string;
    phone: string;
    deliveryString: string;
    weight: number;
    cost: number;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new BadRequestException('NOVA_POSHTA_API_KEY is missing');
    }

    const citySender = process.env.NP_CITY_SENDER_REF;
    const sender = process.env.NP_SENDER_REF;
    const senderAddress = process.env.NP_SENDER_ADDRESS_REF;
    const contactSender = process.env.NP_CONTACT_SENDER_REF;
    const senderPhone = process.env.NP_SENDER_PHONE;

    if (!citySender || !sender || !senderAddress || !contactSender || !senderPhone) {
      throw new BadRequestException('В .env не налаштовано REF-коди відправника НП');
    }

    // 1. Парсимо `deliveryString` (рядок виду: "... Delivery: Хмельницький, Хмельницька обл., Відділення №28 ...")
    let cityName = 'Київ';
    let warehouseStr = '1';

    if (params.deliveryString && params.deliveryString.includes('Delivery:')) {
      const deliveryPart = params.deliveryString.split('Delivery:')[1].trim();
      const parts = deliveryPart.split(',');
      if (parts.length > 0) cityName = parts[0].trim();
      
      const match = deliveryPart.match(/№\s*(\d+)/);
      if (match) warehouseStr = match[1];
    }

    // 2. Шукаємо REF Міста
    const cities = await this.npRequest('Address', 'getCities', { FindByString: cityName });
    if (!cities || cities.length === 0) throw new BadRequestException(`Місто ${cityName} не знайдено в базі НП`);
    const cityRef = cities[0].Ref;

    // 3. Шукаємо REF Відділення
    const warehouses = await this.npRequest('Address', 'getWarehouses', { CityRef: cityRef, FindByString: warehouseStr });
    if (!warehouses || warehouses.length === 0) throw new BadRequestException(`Відділення №${warehouseStr} не знайдено в місті ${cityName}`);
    const warehouseRef = warehouses[0].Ref;

    // 4. Створюємо або отримуємо існуючого Контрагента-Отримувача (PrivatePerson)
    const counterpartyRes = await this.npRequest('Counterparty', 'save', {
      FirstName: params.firstName,
      LastName: params.lastName || 'Клієнт',
      Phone: params.phone, // Формат: 380...
      Email: '',
      CounterpartyType: 'PrivatePerson',
      CounterpartyProperty: 'Recipient'
    });

    const recipientRef = counterpartyRes[0].Ref;
    const contactRecipientRef = counterpartyRes[0].ContactPerson.data[0].Ref;

    // 5. Генеруємо фінальну ТТН
    const documentRes = await this.npRequest('InternetDocument', 'save', {
      PayerType: 'Recipient',
      PaymentMethod: 'Cash',
      DateTime: new Date().toLocaleDateString('uk-UA').replace(/\./g, '.'),
      CargoType: 'Cargo',
      VolumeGeneral: '0.01',
      Weight: params.weight.toString(),
      ServiceType: 'WarehouseWarehouse',
      SeatsAmount: '1',
      Description: `LEGO Order ${params.orderId.slice(-6)}`,
      Cost: params.cost.toString(),
      CitySender: citySender,
      Sender: sender,
      SenderAddress: senderAddress,
      ContactSender: contactSender,
      SendersPhone: senderPhone,
      CityRecipient: cityRef,
      Recipient: recipientRef,
      RecipientAddress: warehouseRef,
      ContactRecipient: contactRecipientRef,
      RecipientsPhone: params.phone,
    });

    return documentRes[0].IntDocNumber;
  }

  async getBulkPdfLink(ttns: string[]): Promise<string> {
    if (ttns.length === 0) throw new BadRequestException('No TTNs provided');
    const query = ttns.map(t => `orders[]/${t}`).join('/');
    return `https://my.novaposhta.ua/orders/printDocument/${query}/type/pdf/aw/1`;
  }

  async handleWebhook(payload: any): Promise<{ ok: boolean }> {
    try {
      const docNumber = payload?.Number || payload?.[0]?.Number;
      const stateId = payload?.StateId || payload?.[0]?.StateId;

      if (!docNumber || !stateId) return { ok: true };

      const order = await this.prisma.order.findFirst({
        where: { adminNote: { contains: docNumber } },
        include: { inventoryItem: true, sale: true }
      });

      if (!order) return { ok: true }; 

      if (['9', '10', '11'].includes(String(stateId))) {
         if (order.status !== 'sold' && order.status !== 'paid') {
           await this.prisma.$transaction(async (tx) => {
             await tx.order.update({
               where: { id: order.id },
               data: { status: 'sold' }
             });
             const phoneStr = order.contact.replace(/[^\d+]/g, '');
             await tx.clientProfile.upsert({
               where: { phone: phoneStr },
               update: { totalOrders: { increment: 1 } },
               create: { phone: phoneStr, name: order.buyerName, totalOrders: 1 }
             });
           });
           this.realtime.emitDashboardRefresh('np_webhook_delivered');
         }
      }

      if (['103', '104', '106'].includes(String(stateId))) {
         if (order.status !== 'cancelled') {
           await this.prisma.$transaction(async (tx) => {
             await tx.order.update({
               where: { id: order.id },
               data: { status: 'cancelled', adminNote: `${order.adminNote} [NP: REFUSED]` }
             });
             
             if (order.inventoryItemId) {
               await tx.inventoryItem.update({
                 where: { id: order.inventoryItemId },
                 data: { quantity: { increment: order.quantity } }
               });
             }
             
             if (order.saleId) {
                await tx.sale.update({
                  where: { id: order.saleId },
                  data: { deletedAt: new Date() } 
                });
             }

             const phoneStr = order.contact.replace(/[^\d+]/g, '');
             const client = await tx.clientProfile.upsert({
                where: { phone: phoneStr },
                update: { refusedCount: { increment: 1 }, fraudScore: { increment: 50 } },
                create: { phone: phoneStr, name: order.buyerName, refusedCount: 1, fraudScore: 50 }
             });

             if (client.fraudScore >= 50 && client.status !== 'blacklisted') {
               await tx.clientProfile.update({ where: { id: client.id }, data: { status: 'blacklisted' }});
             }
           });
           
           await this.activity.log('order.np_refused', { orderId: order.id, docNumber });
           
           if (order.inventoryItemId) {
             this.realtime.emitInventoryRefresh({ inventoryItemId: order.inventoryItemId, reason: 'np_refused_restock' });
           }
           
           this.realtime.emitDashboardRefresh('np_webhook_refused');
         }
      }

      return { ok: true };
    } catch (e) {
      throw new BadRequestException('Webhook processing failed');
    }
  }
}