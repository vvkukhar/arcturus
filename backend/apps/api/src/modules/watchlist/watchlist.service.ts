import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { UpdateWatchlistItemDto } from './dto/update-watchlist-item.dto';

@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(params?: { q?: string; active?: boolean; assignedUserId?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.watchlistItem.findMany({
      where: {
        ...(params?.active != null ? { active: params.active } : {}),
        ...(params?.assignedUserId ? { assignedUserId: params.assignedUserId } : {}),
        ...(q
          ? {
              OR: [
                { titleSnapshot: { contains: q, mode: 'insensitive' } },
                { item: { title: { contains: q, mode: 'insensitive' } } },
                { item: { setNumber: { contains: q, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      orderBy: [{ active: 'desc' }, { priority: 'desc' }, { createdAt: 'desc' }],
      include: { item: true, assignedUser: true },
      take: params?.limit ?? 300,
    });
  }

  async getById(id: string): Promise<unknown> {
    const row = await this.prisma.watchlistItem.findUnique({
      where: { id },
      include: { item: true, assignedUser: true },
    });

    if (!row) throw new NotFoundException('Watchlist item not found');
    return row;
  }

  async create(dto: CreateWatchlistItemDto): Promise<unknown> {
    if (!dto.itemId) throw new BadRequestException('itemId is required');

    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');

    if (dto.assignedUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.assignedUserId } });
      if (!user) throw new NotFoundException('Assigned user not found');
    }

    const created = await this.prisma.watchlistItem.create({
      data: {
        itemId: dto.itemId,
        titleSnapshot: dto.titleSnapshot || item.title,
        desiredBuyPrice: toMoney(dto.desiredBuyPrice),
        maxBuyPrice: toMoney(dto.maxBuyPrice),
        targetSellPrice: dto.targetSellPrice != null ? toMoney(dto.targetSellPrice) : null,
        active: dto.active ?? true,
        priority: dto.priority ?? 50,
        notes: dto.notes ?? null,
        assignedUserId: dto.assignedUserId ?? null,
      },
      include: { item: true, assignedUser: true },
    });

    await this.activity.log('watchlist.created', {
      watchlistItemId: created.id,
      itemId: created.itemId,
      title: created.titleSnapshot,
      desiredBuyPrice: created.desiredBuyPrice,
      maxBuyPrice: created.maxBuyPrice,
      targetSellPrice: created.targetSellPrice,
    });

    if (created.assignedUserId) {
      await this.notifications.createAssignmentNotification({
        targetUserId: created.assignedUserId,
        title: created.titleSnapshot,
        entityType: 'watchlist',
        entityId: created.id,
      });
    }

    this.realtime.emitWatchlistUpdated(created);
    this.realtime.emitDashboardRefresh('watchlist_created');
    this.realtime.emitOpportunityRefresh('watchlist_created');

    return created;
  }

  async update(id: string, data: Partial<UpdateWatchlistItemDto>): Promise<unknown> {
    const existing = await this.prisma.watchlistItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Watchlist item not found');

    if (data.assignedUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: data.assignedUserId } });
      if (!user) throw new NotFoundException('Assigned user not found');
    }

    const updated = await this.prisma.watchlistItem.update({
      where: { id },
      data: {
        desiredBuyPrice: data.desiredBuyPrice != null ? toMoney(data.desiredBuyPrice) : undefined,
        maxBuyPrice: data.maxBuyPrice != null ? toMoney(data.maxBuyPrice) : undefined,
        targetSellPrice: data.targetSellPrice === undefined ? undefined : data.targetSellPrice === null ? null : toMoney(data.targetSellPrice),
        active: data.active,
        titleSnapshot: data.titleSnapshot,
        priority: data.priority,
        notes: data.notes,
        assignedUserId: data.assignedUserId,
      },
      include: { item: true, assignedUser: true },
    });

    await this.activity.log('watchlist.updated', { watchlistItemId: updated.id, itemId: updated.itemId, title: updated.titleSnapshot });

    if (updated.assignedUserId && updated.assignedUserId !== existing.assignedUserId) {
      await this.notifications.createAssignmentNotification({
        targetUserId: updated.assignedUserId,
        title: updated.titleSnapshot,
        entityType: 'watchlist',
        entityId: updated.id,
      });
    }

    this.realtime.emitWatchlistUpdated(updated);
    this.realtime.emitDashboardRefresh('watchlist_updated');
    this.realtime.emitOpportunityRefresh('watchlist_updated');

    return updated;
  }

  async delete(id: string): Promise<unknown> {
    const existing = await this.prisma.watchlistItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Watchlist item not found');

    const deleted = await this.prisma.watchlistItem.delete({ where: { id } });

    await this.activity.log('watchlist.deleted', { watchlistItemId: id, itemId: existing.itemId, title: existing.titleSnapshot });
    this.realtime.emitWatchlistRefresh({ id, deleted: true });
    this.realtime.emitDashboardRefresh('watchlist_deleted');
    this.realtime.emitOpportunityRefresh('watchlist_deleted');

    return deleted;
  }

  async bulkActivate(ids: string[], active: boolean): Promise<unknown> {
    const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : [];
    const result = await this.prisma.watchlistItem.updateMany({ where: { id: { in: safeIds } }, data: { active } });

    await this.activity.log('watchlist.bulk_activate', { ids: safeIds, active, count: result.count });
    this.realtime.emitWatchlistRefresh({ ids: safeIds, active, count: result.count });
    this.realtime.emitDashboardRefresh('watchlist_bulk_activate');
    this.realtime.emitOpportunityRefresh('watchlist_bulk_activate');

    return result;
  }

  async bulkDelete(ids: string[]): Promise<unknown> {
    const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : [];
    const result = await this.prisma.watchlistItem.deleteMany({ where: { id: { in: safeIds } } });

    await this.activity.log('watchlist.bulk_delete', { ids: safeIds, count: result.count });
    this.realtime.emitWatchlistRefresh({ ids: safeIds, deleted: true, count: result.count });
    this.realtime.emitDashboardRefresh('watchlist_bulk_delete');
    this.realtime.emitOpportunityRefresh('watchlist_bulk_delete');

    return result;
  }

  async stats(): Promise<unknown> {
    const agg = await this.prisma.watchlistItem.groupBy({
      by: ['active'],
      _count: { _all: true },
    });
    
    const highPriority = await this.prisma.watchlistItem.count({ where: { priority: { gte: 75 } } });
    const assigned = await this.prisma.watchlistItem.count({ where: { assignedUserId: { not: null } } });

    const total = agg.reduce((sum, a) => sum + a._count._all, 0);
    const active = agg.find(a => a.active)?._count._all ?? 0;
    const inactive = agg.find(a => !a.active)?._count._all ?? 0;

    return { total, active, inactive, highPriority, assigned };
  }
}