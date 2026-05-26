import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TelegramService } from './telegram.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { NovaPoshtaService } from '../shipping/nova-poshta.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class TelegramWebhookService {
  private readonly logger = new Logger(TelegramWebhookService.name);
  private readonly adminChatId = process.env.TELEGRAM_CHAT_ID;

  constructor(
    private readonly prisma: PrismaService,
    private readonly telegram: TelegramService,
    private readonly realtime: RealtimeGateway,
    private readonly novaPoshta: NovaPoshtaService
  ) {}

  async processMessage(message: any): Promise<void> {
    const chatId = message.chat?.id?.toString();
    const text = message.text?.trim() || '';
    const senderName = message.from?.first_name || 'TG User';
    const tgUsername = message.from?.username ? `@${message.from.username}` : '';

    if (!chatId || !text) return;

    if (chatId === this.adminChatId) {
      if (text.startsWith('/stats')) return this.handleAdminStats(chatId);
      if (text.startsWith('/search')) return this.handleAdminSearch(chatId, text);
    }

    if (text.startsWith('/start')) {
      await this.telegram.editMessage(chatId, message.message_id, 
        `🤖 <b>Arcturus OS Bot</b>\n\nПривіт, ${senderName}!\n` +
        `📦 <b>Трекінг:</b> <code>/track [номер]</code>\n` +
        `🕵️‍♂️ <b>Скаут:</b> Надішліть посилання на LEGO`
      );
      return;
    }

    if (text.startsWith('/track')) return this.handleClientTracking(chatId, text);
    if (text.startsWith('http')) return this.handleScoutLead(chatId, senderName, text, tgUsername);

    await this.telegram.editMessage(chatId, message.message_id, `Невідома команда.`);
  }

  async processCallback(callbackQuery: any): Promise<void> {
    const data = callbackQuery.data; 
    const chatId = callbackQuery.message?.chat?.id?.toString();
    const messageId = callbackQuery.message?.message_id;

    if (!data || chatId !== this.adminChatId) return;

    if (data.startsWith('order_ttn_')) {
      const orderId = data.replace('order_ttn_', '');
      await this.handleGenerateTTN(chatId, messageId, orderId);
    } else if (data.startsWith('order_cancel_')) {
      const orderId = data.replace('order_cancel_', '');
      await this.handleCancelOrder(chatId, messageId, orderId);
    } else if (data.startsWith('deal_buy_')) {
      const dealId = data.replace('deal_buy_', '');
      await this.handleBuyDeal(chatId, messageId, dealId);
    } else if (data.startsWith('deal_skip_')) {
      await this.telegram.editMessage(chatId, messageId, `❌ Угоду пропущено.`);
    }
  }

  private async handleGenerateTTN(chatId: string, messageId: number, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return;

    if (order.adminNote?.includes('[TTN:')) {
      await this.telegram.editMessage(chatId, messageId, `⚠️ ТТН вже створена для: ${order.productTitle}`);
      return;
    }

    try {
      const parts = order.buyerName.split(' ');
      const ttn = await this.novaPoshta.createExpressWaybill({
        orderId: order.id,
        firstName: parts[0] || 'Клієнт',
        lastName: parts[1] || '',
        phone: order.contact.replace(/[^\d+]/g, '').slice(0, 13),
        cityRecipient: 'Київ',
        warehouseRecipient: 'Відділення №1',
        weight: 2.5,
        cost: order.sellPrice ?? 2000
      });

      const updatedAdminNote = `${order.adminNote ?? ''} [TTN: ${ttn}]`.trim();
      await this.prisma.order.update({
        where: { id: order.id },
        data: { adminNote: updatedAdminNote, status: 'sold' }
      });

      await this.telegram.editMessage(chatId, messageId, `✅ <b>ТТН ЗГЕНЕРОВАНО</b>\n\n📦 ${order.productTitle}\n🚚 ТТН: <code>${ttn}</code>\nСтатус змінено на Sold.`);
      this.realtime.emitDashboardRefresh('tg_ttn_generated');
    } catch (e: any) {
      await this.telegram.editMessage(chatId, messageId, `❌ <b>Помилка НП:</b> ${e.message}`);
    }
  }

  private async handleCancelOrder(chatId: string, messageId: number, orderId: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return;

    await this.prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'cancelled', adminNote: `${order.adminNote} [Скасовано з ТГ]` }
      });
      if (order.inventoryItemId) {
        await tx.inventoryItem.update({
          where: { id: order.inventoryItemId },
          data: { quantity: { increment: order.quantity } }
        });
      }
    });

    await this.telegram.editMessage(chatId, messageId, `❌ Замовлення скасовано: ${order.productTitle}`);
    this.realtime.emitDashboardRefresh('tg_order_cancelled');
  }

  private async handleBuyDeal(chatId: string, messageId: number, dealId: string) {
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) return;

    await this.prisma.purchaseFlowItem.create({
      data: {
        watchlistItemId: deal.watchlistItemId,
        selectedPrice: deal.buyPrice,
        status: 'pending',
        reason: 'Added via Telegram Quick Action',
      }
    });

    await this.prisma.deal.update({ where: { id: dealId }, data: { status: 'queued' }});
    
    await this.telegram.editMessage(chatId, messageId, `✅ Угоду додано в Purchase Queue. Товар готовий до викупу.`);
    this.realtime.emitFlowRefresh('purchase');
  }

  private async handleScoutLead(chatId: string, name: string, url: string, tgUsername: string) {
    const cleanUrl = url.trim();
    const scoutEmail = `${chatId}@telegram.bot`;
    let scout = await this.prisma.user.findUnique({ where: { email: scoutEmail } });
    
    if (!scout) {
      scout = await this.prisma.user.create({
        data: { name: `${name} (TG Scout)`, email: scoutEmail, role: 'viewer', active: true, phone: tgUsername }
      });
    }

    const existing = await this.prisma.scoutLead.findFirst({ where: { url: cleanUrl } });
    if (existing) {
      await this.telegram.sendMessage(`⚠️ Лінк вже в базі!`);
      return;
    }

    await this.prisma.scoutLead.create({
      data: { scoutId: scout.id, url: cleanUrl, notes: 'Telegram', status: 'pending' }
    });

    await this.telegram.sendMessage(`🎯 Лід прийнято! Чекайте на нарахування.`);
    if (this.adminChatId && chatId !== this.adminChatId) {
      await this.telegram.sendMessage(`🕵️‍♂️ <b>Новий лід від скаута:</b>\n${name} ${tgUsername}\n${cleanUrl}`);
    }
  }

  private async handleClientTracking(chatId: string, text: string) {
    const query = text.replace('/track', '').trim();
    if (!query) return;
    const order = await this.prisma.order.findFirst({
      where: { OR: [{ id: query }, { contact: { contains: query } }] },
      orderBy: { createdAt: 'desc' }
    });
    if (!order) {
      await this.telegram.sendMessage(`📦 Замовлення не знайдено.`);
      return;
    }
    const msg = `📦 <b>${order.productTitle}</b>\nСтатус: <b>${order.status.toUpperCase()}</b>\nТТН: <i>${order.adminNote || 'Очікуйте'}</i>`;
    await this.telegram.sendMessage(msg);
  }

  private async handleAdminStats(chatId: string) {
    const sales = await this.prisma.sale.aggregate({ _sum: { profit: true, sellPrice: true }, _count: true });
    const inventory = await this.prisma.inventoryItem.count({ where: { quantity: { gt: 0 } } });
    
    const msg = `📊 <b>Arcturus Stats:</b>\n\n` +
                `📦 На складі: <b>${inventory}</b> шт\n` +
                `✅ Продано: <b>${sales._count}</b>\n` +
                `📈 Прибуток: <b>${toMoney(sales._sum.profit || 0)} ₴</b>`;
    await this.telegram.sendMessage(msg);
  }

  private async handleAdminSearch(chatId: string, text: string) {
    const query = text.replace('/search', '').trim();
    if (!query) return;

    const item = await this.prisma.item.findFirst({
      where: { setNumber: query },
      include: {
          marketSnapshots: { orderBy: { computedAt: 'desc' }, take: 1 },
          inventoryItems: { where: { quantity: { gt: 0 } }, select: { quantity: true, totalCost: true } }
      }
    });

    if (!item) {
        await this.telegram.sendMessage(`🔍 Набір <b>${query}</b> не знайдено.`);
        return;
    }

    const snap = item.marketSnapshots[0];
    const stockQty = item.inventoryItems.reduce((acc, curr) => acc + curr.quantity, 0);
    const avgCost = item.inventoryItems.length > 0 
      ? item.inventoryItems.reduce((acc, curr) => acc + curr.totalCost, 0) / item.inventoryItems.length 
      : 0;

    if (!snap) return;

    const msg = `📦 <b>${item.title}</b> [${item.setNumber}]\n` +
                `🏷 Медіана: <b>${toMoney(snap.medianPrice)} ₴</b>\n` +
                `📊 Конкурентів: <b>${snap.listingsCount}</b>\n\n` +
                `🏢 На складі: <b>${stockQty} шт.</b> (Собівартість: ${toMoney(avgCost)} ₴)`;
    await this.telegram.sendMessage(msg);
  }
}