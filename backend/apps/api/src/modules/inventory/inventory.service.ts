import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateInventoryItemDto } from './dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from './dto/update-inventory-item.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
  ) {}

  async list(params?: { q?: string; assignedUserId?: string; status?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.inventoryItem.findMany({
      where: {
        ...(params?.assignedUserId ? { assignedUserId: params.assignedUserId } : {}),
        ...(params?.status === 'available' ? { quantity: { gt: 0 } } : {}),
        ...(params?.status === 'sold' ? { quantity: { lte: 0 } } : {}),
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
      include: {
        item: true,
        assignedUser: true,
        images: { orderBy: { sortOrder: 'asc' } },
      },
      orderBy: [{ quantity: 'desc' }, { createdAt: 'desc' }],
      take: params?.limit ?? 200,
    });
  }

  async getById(id: string): Promise<unknown> {
    const row = await this.prisma.inventoryItem.findUnique({
      where: { id },
      include: {
        item: true,
        assignedUser: true,
        images: { orderBy: { sortOrder: 'asc' } },
        sales: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!row) throw new NotFoundException('Inventory item not found');
    return row;
  }

  async create(dto: CreateInventoryItemDto): Promise<unknown> {
    if (!dto.itemId) throw new BadRequestException('itemId is required');

    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');

    if (dto.assignedUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.assignedUserId } });
      if (!user) throw new NotFoundException('Assigned user not found');
    }

    const purchasePrice = toMoney(dto.purchasePrice);
    const quantity = dto.quantity ?? 1;
    const totalCost = toMoney(dto.totalCost ?? purchasePrice * quantity);

    const created = await this.prisma.inventoryItem.create({
      data: {
        itemId: dto.itemId,
        titleSnapshot: dto.titleSnapshot || item.title,
        purchasePrice,
        totalCost,
        quantity,
        condition: dto.condition ?? item.conditionDefault ?? 'used',
        sealed: dto.sealed ?? false,
        expectedSalePriceManual: dto.expectedSalePriceManual != null ? toMoney(dto.expectedSalePriceManual) : null,
        source: dto.source ?? null,
        purchaseUrl: dto.purchaseUrl ?? null,
        storageLocation: dto.storageLocation ?? null,
        notes: dto.notes ?? null,
        assignedUserId: dto.assignedUserId ?? null,
        priority: dto.priority ?? 50,
      },
      include: { item: true, assignedUser: true, images: true },
    });

    await this.activity.log('inventory.created', {
      inventoryItemId: created.id,
      itemId: created.itemId,
      title: created.titleSnapshot,
      purchasePrice,
      totalCost,
      quantity,
    });

    if (created.assignedUserId) {
      await this.notifications.createAssignmentNotification({
        targetUserId: created.assignedUserId,
        title: created.titleSnapshot,
        entityType: 'inventory',
        entityId: created.id,
      });
    }

    this.realtime.emitInventoryUpdated(created);
    this.realtime.emitDashboardRefresh('inventory_created');
    this.realtime.emitOpportunityRefresh('inventory_created');

    return created;
  }

  async update(dto: UpdateInventoryItemDto): Promise<unknown> {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Inventory item not found');

    if (dto.assignedUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.assignedUserId } });
      if (!user) throw new NotFoundException('Assigned user not found');
    }

    const updated = await this.prisma.inventoryItem.update({
      where: { id: dto.id },
      data: {
        titleSnapshot: dto.titleSnapshot,
        purchasePrice: dto.purchasePrice != null ? toMoney(dto.purchasePrice) : undefined,
        totalCost: dto.totalCost != null ? toMoney(dto.totalCost) : undefined,
        quantity: dto.quantity,
        condition: dto.condition,
        sealed: dto.sealed,
        expectedSalePriceManual: dto.expectedSalePriceManual === undefined ? undefined : dto.expectedSalePriceManual === null ? null : toMoney(dto.expectedSalePriceManual),
        source: dto.source,
        purchaseUrl: dto.purchaseUrl,
        storageLocation: dto.storageLocation,
        notes: dto.notes,
        assignedUserId: dto.assignedUserId,
        priority: dto.priority,
      },
      include: { item: true, assignedUser: true, images: { orderBy: { sortOrder: 'asc' } } },
    });

    await this.activity.log('inventory.updated', { inventoryItemId: updated.id, itemId: updated.itemId, title: updated.titleSnapshot });

    if (updated.assignedUserId && updated.assignedUserId !== existing.assignedUserId) {
      await this.notifications.createAssignmentNotification({
        targetUserId: updated.assignedUserId,
        title: updated.titleSnapshot,
        entityType: 'inventory',
        entityId: updated.id,
      });
    }

    this.realtime.emitInventoryUpdated(updated);
    this.realtime.emitDashboardRefresh('inventory_updated');
    this.realtime.emitOpportunityRefresh('inventory_updated');

    return updated;
  }

  async delete(id: string): Promise<unknown> {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Inventory item not found');

    const deleted = await this.prisma.inventoryItem.delete({ where: { id } });

    await this.activity.log('inventory.deleted', { inventoryItemId: id, itemId: existing.itemId, title: existing.titleSnapshot });
    this.realtime.emitInventoryRefresh({ id, deleted: true });
    this.realtime.emitDashboardRefresh('inventory_deleted');
    this.realtime.emitOpportunityRefresh('inventory_deleted');

    return deleted;
  }

  async bulkDelete(ids: string[]): Promise<unknown> {
    const safeIds = Array.isArray(ids) ? ids.filter(Boolean) : [];
    if (safeIds.length === 0) return { count: 0 };

    const result = await this.prisma.inventoryItem.deleteMany({ where: { id: { in: safeIds } } });

    await this.activity.log('inventory.bulk_deleted', { ids: safeIds, count: result.count });
    this.realtime.emitInventoryRefresh({ ids: safeIds, deleted: true, count: result.count });
    this.realtime.emitDashboardRefresh('inventory_bulk_deleted');
    this.realtime.emitOpportunityRefresh('inventory_bulk_deleted');

    return result;
  }

  async exportRows(): Promise<unknown[]> {
    const rows = await this.prisma.inventoryItem.findMany({
      include: { item: true, assignedUser: true },
      orderBy: { createdAt: 'desc' },
    });

    return rows.map((row) => ({
      id: row.id,
      itemId: row.itemId,
      setNumber: row.item?.setNumber ?? '',
      title: row.titleSnapshot,
      theme: row.item?.theme ?? '',
      kind: row.item?.kind ?? '',
      purchasePrice: row.purchasePrice,
      totalCost: row.totalCost,
      expectedSalePriceManual: row.expectedSalePriceManual ?? '',
      quantity: row.quantity,
      condition: row.condition,
      sealed: row.sealed,
      assignedUser: row.assignedUser?.name ?? '',
      storageLocation: row.storageLocation ?? '',
      source: row.source ?? '',
      createdAt: row.createdAt,
    }));
  }

  async stats(): Promise<unknown> {
    const agg = await this.prisma.inventoryItem.aggregate({
      _count: true,
      _sum: { quantity: true, totalCost: true, expectedSalePriceManual: true }
    });

    const rows = await this.prisma.inventoryItem.findMany({ select: { quantity: true, totalCost: true, expectedSalePriceManual: true } });

    const totalCost = toMoney(agg._sum.totalCost ?? 0);
    const expectedValue = toMoney(rows.reduce((sum, row) => sum + Number(row.expectedSalePriceManual ?? row.totalCost ?? 0) * Math.max(row.quantity, 1), 0));

    return {
      totalItems: agg._count,
      totalUnits: agg._sum.quantity ?? 0,
      totalCost,
      expectedValue,
      expectedProfit: toMoney(expectedValue - totalCost),
      availableItems: rows.filter((row) => row.quantity > 0).length,
      soldOutItems: rows.filter((row) => row.quantity <= 0).length,
    };
  }
}