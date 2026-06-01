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

  async createExpressWaybill(params: {
    orderId: string;
    firstName: string;
    lastName: string;
    phone: string;
    cityRecipient: string;
    warehouseRecipient: string;
    weight: number;
    cost: number;
  }): Promise<string> {
    if (!this.apiKey) {
      throw new BadRequestException('NOVA_POSHTA_API_KEY is missing in environment variables');
    }

    const citySender = process.env.NP_CITY_SENDER_REF;
    const sender = process.env.NP_SENDER_REF;
    const senderAddress = process.env.NP_SENDER_ADDRESS_REF;
    const contactSender = process.env.NP_CONTACT_SENDER_REF;
    const senderPhone = process.env.NP_SENDER_PHONE;

    if (!citySender || !sender || !senderAddress || !contactSender || !senderPhone) {
      throw new BadRequestException('Не налаштовані всі параметри відправника Нової Пошти (REF коди) у змінних оточення.');
    }

    const payload = {
      apiKey: this.apiKey,
      modelName: 'InternetDocument',
      calledMethod: 'save',
      methodProperties: {
        PayerType: 'Recipient',
        PaymentMethod: 'Cash',
        DateTime: new Date().toLocaleDateString('uk-UA').replace(/\./g, '.'),
        CargoType: 'Cargo',
        VolumeGeneral: '0.01',
        Weight: params.weight.toString(),
        ServiceType: 'WarehouseWarehouse',
        SeatsAmount: '1',
        Description: `LEGO Order ${params.orderId}`,
        Cost: params.cost.toString(),
        CitySender: citySender,
        Sender: sender,
        SenderAddress: senderAddress,
        ContactSender: contactSender,
        SendersPhone: senderPhone,
        RecipientCityName: params.cityRecipient,
        RecipientArea: '',
        RecipientAreaRegions: '',
        AddressRecipient: params.warehouseRecipient,
        RecipientsPhone: params.phone,
        RecipientName: `${params.firstName} ${params.lastName}`
      }
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new BadRequestException(`Помилка НП: ${data.errors.join(', ')}`);
    }

    return data.data[0].IntDocNumber;
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

      // 9, 10, 11 - Отримано
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

      // 103, 104, 106 - Відмова
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