import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { TelegramService } from './telegram.service';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly telegram: TelegramService,
  ) {}

  async create(data: { title: string; message: string; type: string; payloadJson?: any; targetUserId?: string | null }) {
    const notification = await this.prisma.notification.create({
      data: {
        title: data.title,
        message: data.message,
        type: data.type,
        payloadJson: data.payloadJson ?? {},
        targetUserId: data.targetUserId,
      },
    });
    this.realtime.emitCustom('notification', notification);
    return notification;
  }

  async createSaleNotification(data: { itemTitle: string; profit: number; targetUserId?: string | null }) {
    const msg = `${data.itemTitle} продано. Прибуток: +${data.profit}₴`;
    await this.telegram.sendMessage(`✅ <b>SALE CONFIRMED</b>\n\n${msg}`);
    return this.create({
      title: 'Новий продаж!',
      message: msg,
      type: 'sale',
      payloadJson: { profit: data.profit },
      targetUserId: data.targetUserId,
    });
  }

  async createReserveNotification(data: { reserveId: string; productTitle: string; customerName: string; contact: string }) {
    const msg = `🔔 <b>НОВИЙ РЕЗЕРВ</b>\n\n📦 Товар: ${data.productTitle}\n👤 Клієнт: ${data.customerName}\n📱 Контакт: ${data.contact}`;
    const keyboard = [
      [
        { text: '✅ Підтвердити', callback_data: `reserve_approve_${data.reserveId}` },
        { text: '❌ Відхилити', callback_data: `reserve_reject_${data.reserveId}` }
      ]
    ];
    await this.telegram.sendMessage(msg, keyboard);
    return this.create({
      title: 'Новий резерв',
      message: `${data.productTitle} • ${data.customerName}`,
      type: 'reserve',
      payloadJson: { reserveRequestId: data.reserveId },
    });
  }

  async createDealNotification(data: { itemTitle: string; roi: number; action: string; profit?: number; buyPrice?: number; url?: string; targetUserId?: string | null }) {
    if (data.action === 'BUY_NOW' && data.url && data.profit && data.buyPrice) {
      await this.telegram.sendDealAlert({
        title: data.itemTitle,
        roi: data.roi,
        profit: data.profit,
        buyPrice: data.buyPrice,
        url: data.url,
      });
    }
    return this.create({
      title: 'New Deal Detected!',
      message: `${data.itemTitle} - ROI: ${data.roi}%`,
      type: 'deal',
      payloadJson: { roi: data.roi, action: data.action },
      targetUserId: data.targetUserId,
    });
  }

  async createAssignmentNotification(data: { targetUserId: string; title: string; entityType: string; entityId: string }) {
    return this.create({
      title: 'New Assignment',
      message: `You have been assigned to ${data.title}`,
      type: 'assignment',
      payloadJson: { entityType: data.entityType, entityId: data.entityId },
      targetUserId: data.targetUserId,
    });
  }

  async markAsRead(id: string) {
    return this.prisma.notification.update({ where: { id }, data: { read: true } });
  }

  async markAllRead(targetUserId?: string) {
    return this.prisma.notification.updateMany({
      where: { read: false, ...(targetUserId ? { targetUserId } : {}) },
      data: { read: true },
    });
  }

  async list(params: { targetUserId?: string; unreadOnly?: boolean; limit?: number }) {
    return this.prisma.notification.findMany({
      where: {
        ...(params.targetUserId ? { targetUserId: params.targetUserId } : {}),
        ...(params.unreadOnly ? { read: false } : {}),
      },
      orderBy: { createdAt: 'desc' },
      take: params.limit ?? 50,
    });
  }

  async unreadCount(targetUserId?: string) {
    const unread = await this.prisma.notification.count({
      where: { read: false, ...(targetUserId ? { targetUserId } : {}) },
    });
    return { unread };
  }
}