import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import * as crypto from 'crypto';

@Injectable()
export class PaymentsService {
  private readonly monoToken = process.env.MONOBANK_TOKEN!;
  private readonly storeUrl = process.env.PUBLIC_STORE_BASE_URL!;
  private readonly apiUrl = process.env.API_BASE!;

  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async createCheckoutSession(orderId: string): Promise<{ url: string }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status === 'paid' || order.status === 'sold') {
      throw new BadRequestException('Order is already paid or sold');
    }
    if (!order.sellPrice || order.sellPrice <= 0) {
      throw new BadRequestException('Invalid order price for checkout');
    }

    const amountKopecks = Math.round(order.sellPrice * 100);

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': this.monoToken,
      },
      body: JSON.stringify({
        amount: amountKopecks,
        ccy: 980,
        reference: order.id,
        redirectUrl: `${this.storeUrl}/success`,
        webHookUrl: `${this.apiUrl}/payments/webhook`,
        merchantPaymInfo: {
          reference: order.id,
          destination: `Оплата замовлення: ${order.productTitle}`,
          basketOrder: [
            {
              name: order.productTitle,
              qty: order.quantity,
              sum: amountKopecks,
              total: amountKopecks,
            }
          ]
        }
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new BadRequestException(`Monobank error: ${err}`);
    }

    const data = await response.json();
    return { url: data.pageUrl };
  }

  verifySignature(pubKeyBase64: string, xSignBase64: string, body: any): boolean {
    try {
      const pubKeyBuf = Buffer.from(pubKeyBase64, 'base64');
      const signatureBuf = Buffer.from(xSignBase64, 'base64');
      const messageBuf = Buffer.from(JSON.stringify(body), 'utf8');

      const verify = crypto.createVerify('SHA256');
      verify.update(messageBuf);
      verify.end();

      const keyObj = crypto.createPublicKey({
        key: pubKeyBuf,
        format: 'der',
        type: 'spki',
      });

      return verify.verify(keyObj, signatureBuf);
    } catch {
      return false;
    }
  }

  async handleWebhook(body: any, xSignBase64?: string): Promise<{ received: boolean }> {
    if (!xSignBase64) {
      throw new BadRequestException('Missing X-Sign header');
    }

    const keyRes = await fetch('https://api.monobank.ua/api/merchant/pubkey', {
      headers: { 'X-Token': this.monoToken },
    });
    
    if (!keyRes.ok) throw new BadRequestException('Failed to fetch Mono pubkey');
    const { key: pubKeyBase64 } = await keyRes.json();

    if (!this.verifySignature(pubKeyBase64, xSignBase64, body)) {
      throw new BadRequestException('Invalid signature');
    }

    if (body.status === 'success' && body.reference) {
      await this.processSuccessfulPayment(body.reference, body.amount);
    }

    return { received: true };
  }

  private async processSuccessfulPayment(orderId: string, amountTotalKopecks: number): Promise<void> {
    const order = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'paid' },
      include: { inventoryItem: true },
    });

    const amountUah = amountTotalKopecks / 100;

    await this.prisma.activityLog.create({
      data: {
        action: 'payment.received',
        payloadJson: { orderId, amount: amountUah },
      },
    });

    await this.notifications.create({
      title: 'Успішна оплата!',
      message: `Замовлення ${order.productTitle} сплачено. Сума: ${amountUah} UAH`,
      type: 'payment',
      payloadJson: { orderId: order.id },
    });

    this.realtime.emitCustom('order.paid', order);
    this.realtime.emitDashboardRefresh('order_paid');
  }
}