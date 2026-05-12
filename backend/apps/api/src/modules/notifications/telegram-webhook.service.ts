import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from './telegram.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class TelegramWebhookService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly realtime: RealtimeGateway
  ) {}

  async processMessage(message: any): Promise<void> {
    const chatId = message.chat?.id?.toString();
    const text = message.text?.trim();
    if (chatId !== process.env.TELEGRAM_CHAT_ID) return;

    if (text?.startsWith('/stats')) {
      const sales = await this.prisma.sale.aggregate({ _sum: { profit: true, sellPrice: true }, _count: true });
      const reserves = await this.prisma.reserveRequest.count({ where: { status: 'pending' } });
      const inventory = await this.prisma.inventoryItem.count({ where: { quantity: { gt: 0 } } });
      
      const msg = `📊 <b>Статус системи:</b>\n\n📦 В наявності: ${inventory}\n⏳ Очікують резерву: ${reserves}\n✅ Продажів: ${sales._count}\n💰 Дохід: ${sales._sum.sellPrice || 0} ₴\n📈 Прибуток: ${sales._sum.profit || 0} ₴`;
      await this.telegram.sendMessage(msg);
    }
  }

  async processCallback(callbackQuery: any): Promise<void> {
    const data = callbackQuery.data;
    const chatId = callbackQuery.message?.chat?.id?.toString();
    if (chatId !== process.env.TELEGRAM_CHAT_ID) return;

    if (data.startsWith('reserve_')) {
      const [_, action, id] = data.split('_');
      const reserve = await this.prisma.reserveRequest.findUnique({ where: { id } });
      if (!reserve) return;

      if (action === 'approve') {
        await this.prisma.reserveRequest.update({ where: { id }, data: { status: 'approved', adminNote: 'Approved via Telegram' } });
        await this.prisma.order.updateMany({ where: { reserveRequestId: id }, data: { status: 'approved' } });
        await this.telegram.sendMessage(`✅ Резерв для <b>${reserve.productTitle}</b> підтверджено.`);
        this.realtime.emitDashboardRefresh('reserve_approved_tg');
      } else if (action === 'reject') {
        await this.prisma.reserveRequest.update({ where: { id }, data: { status: 'rejected', adminNote: 'Rejected via Telegram' } });
        await this.prisma.order.updateMany({ where: { reserveRequestId: id }, data: { status: 'cancelled' } });
        await this.telegram.sendMessage(`❌ Резерв для <b>${reserve.productTitle}</b> відхилено.`);
        this.realtime.emitDashboardRefresh('reserve_rejected_tg');
      }
    }
  }
}