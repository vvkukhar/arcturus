import { Injectable, NotFoundException } from '@nestjs/common';
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

  async create(params: {
    title: string;
    message: string;
    type?: string;
    targetUserId?: string | null;
    payloadJson?: object;
  }): Promise<unknown> {
    if (params.targetUserId) {
      const user = await this.prisma.user.findUnique({
        where: {
          id: params.targetUserId,
        },
      });

      if (!user) {
        throw new NotFoundException('Target user not found');
      }
    }

    const notification = await this.prisma.notification.create({
      data: {
        title: params.title,
        message: params.message,
        type: params.type ?? 'info',
        targetUserId: params.targetUserId ?? null,
        payloadJson: params.payloadJson ?? {},
        read: false,
      },
      include: {
        targetUser: true,
      },
    });

    this.realtime.emitNotification(notification);

    return notification;
  }

  async createDealNotification(params: {
    itemTitle: string;
    roi: number;
    action: string;
    targetUserId?: string | null;
  }): Promise<unknown> {
    const notification = await this.create({
      title: 'Deal detected',
      message: `${params.itemTitle} • ${params.action} • ROI ${params.roi.toFixed(2)}%`,
      type: 'deal',
      targetUserId: params.targetUserId ?? null,
      payloadJson: params,
    });

    if (params.action === 'BUY_NOW') {
      const tgMessage = `🚨 <b>УВАГА: STRONG BUY</b> 🚨\n\n📦 <b>Товар:</b> ${params.itemTitle}\n📈 <b>ROI:</b> ${params.roi.toFixed(2)}%\n\n<i>Дій швидко, заходь в адмінку!</i>`;
      await this.telegram.sendMessage(tgMessage);
    }

    return notification;
  }

  async createSaleNotification(params: {
    itemTitle: string;
    profit: number;
    targetUserId?: string | null;
  }): Promise<unknown> {
    const notification = await this.create({
      title: 'Sale registered',
      message: `${params.itemTitle} • profit ${params.profit}`,
      type: 'sale',
      targetUserId: params.targetUserId ?? null,
      payloadJson: params,
    });

    const tgMessage = `💰 <b>НОВИЙ ПРОДАЖ</b> 💰\n\n📦 <b>Товар:</b> ${params.itemTitle}\n💵 <b>Чистий профіт:</b> ${params.profit} UAH\n\n<i>Гарна робота!</i>`;
    await this.telegram.sendMessage(tgMessage);

    return notification;
  }

  async createAssignmentNotification(params: {
    targetUserId: string;
    title: string;
    entityType: 'inventory' | 'watchlist' | 'flow';
    entityId: string;
  }): Promise<unknown> {
    return this.create({
      title: 'New assignment',
      message: `${params.title} assigned to you`,
      type: 'assignment',
      targetUserId: params.targetUserId,
      payloadJson: {
        entityType: params.entityType,
        entityId: params.entityId,
      },
    });
  }

  async list(params?: {
    targetUserId?: string | null;
    unreadOnly?: boolean;
    limit?: number;
  }): Promise<unknown[]> {
    return this.prisma.notification.findMany({
      where: {
        ...(params?.targetUserId
          ? {
              OR: [
                {
                  targetUserId: params.targetUserId,
                },
                {
                  targetUserId: null,
                },
              ],
            }
          : {}),
        ...(params?.unreadOnly ? { read: false } : {}),
      },
      include: {
        targetUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.limit ?? 50,
    });
  }

  async markRead(id: string): Promise<unknown> {
    return this.prisma.notification.update({
      where: {
        id,
      },
      data: {
        read: true,
      },
    });
  }

  async markAllRead(targetUserId?: string): Promise<unknown> {
    return this.prisma.notification.updateMany({
      where: {
        read: false,
        ...(targetUserId
          ? {
              OR: [
                {
                  targetUserId,
                },
                {
                  targetUserId: null,
                },
              ],
            }
          : {}),
      },
      data: {
        read: true,
      },
    });
  }

  async unreadCount(targetUserId?: string): Promise<{
    unread: number;
  }> {
    const unread = await this.prisma.notification.count({
      where: {
        read: false,
        ...(targetUserId
          ? {
              OR: [
                {
                  targetUserId,
                },
                {
                  targetUserId: null,
                },
              ],
            }
          : {}),
      },
    });

    return {
      unread,
    };
  }
}