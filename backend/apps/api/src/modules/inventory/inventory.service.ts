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

  async list(params?: { q?: string; assignedUserId?: string; status?: string; limit?: number; offset?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.inventoryItem.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
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
      include: {
        item: true,
        assignedUser: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0, // ФІКС: Реалізація пагінації на рівні БД
    });
  }

  async stats(): Promise<unknown> {
    const agg = await this.prisma.inventoryItem.aggregate({
      _count: { _all: true },
      _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true },
    });
    return {
      totalItems: agg._count._all,
      totalUnits: agg._sum.quantity ?? 0,
      totalCost: toMoney(agg._sum.totalCost ?? 0),
      expectedRevenue: toMoney(agg._sum.expectedSalePriceManual ?? agg._sum.totalCost ?? 0),
    };
  }

  async getById(id: string): Promise<unknown> {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id },
      include: { item: true, assignedUser: true, images: { orderBy: { sortOrder: 'asc' } }, location: { include: { warehouse: true } } },
    });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async create(dto: CreateInventoryItemDto): Promise<unknown> {
    const purchasePrice = toMoney(dto.purchasePrice);
    const quantity = dto.quantity ?? 1;
    const extraCosts = dto.extraCosts ?? 0;
    const shippingToMe = dto.shippingToMe ?? 0;
    const totalCost = toMoney(dto.totalCost ?? (purchasePrice * quantity) + extraCosts + shippingToMe);

    const result = await this.prisma.$transaction(async (tx) => {
      const item = await tx.item.upsert({
        where: {
          setNumber_kind: {
            setNumber: dto.setNumber ?? 'UNKNOWN',
            kind: dto.kind ?? 'set',
          },
        },
        update: {},
        create: {
          title: dto.titleSnapshot,
          setNumber: dto.setNumber,
          kind: dto.kind ?? 'set',
          theme: dto.theme,
          conditionDefault: dto.condition ?? 'used',
        },
      });

      const inventoryItem = await tx.inventoryItem.create({
        data: {
          itemId: item.id,
          titleSnapshot: dto.titleSnapshot || item.title,
          purchasePrice,
          totalCost,
          quantity,
          condition: dto.condition ?? item.conditionDefault ?? 'used',
          sealed: dto.sealed ?? false,
          expectedSalePriceManual: dto.expectedSalePriceManual != null ? toMoney(dto.expectedSalePriceManual) : null,
          source: dto.source ?? null,
          storageLocationId: dto.storageLocationId ?? null,
          warehouseId: dto.warehouseId ?? null,
          assignedUserId: dto.assignedUserId ?? null,
        },
        include: { item: true, assignedUser: true, images: true },
      });

      if (extraCosts > 0 || shippingToMe > 0) {
        await tx.expense.create({
          data: {
            inventoryItemId: inventoryItem.id,
            category: 'logistics',
            type: 'purchase',
            amount: toMoney(extraCosts + shippingToMe),
            description: 'Logistics and extra costs for procurement',
          },
        });
      }

      return inventoryItem;
    });

    await this.activity.log('inventory.created', {
      inventoryItemId: result.id,
      itemId: result.itemId,
      totalCost,
    });

    this.realtime.emitInventoryUpdated(result);
    return result;
  }

  async update(dto: UpdateInventoryItemDto): Promise<unknown> {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Inventory item not found');

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
        storageLocationId: dto.storageLocationId,
      },
      include: { item: true, assignedUser: true, images: { orderBy: { sortOrder: 'asc' } } },
    });

    this.realtime.emitInventoryUpdated(updated);
    return updated;
  }

  async delete(id: string): Promise<unknown> {
    const existing = await this.prisma.inventoryItem.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Inventory item not found');

    const deleted = await this.prisma.inventoryItem.delete({ where: { id } });

    await this.activity.log('inventory.deleted', {
      inventoryItemId: id,
      title: existing.titleSnapshot,
    });

    this.realtime.emitInventoryRefresh({ id, deleted: true });
    return deleted;
  }

  async bulkDelete(ids: string[]): Promise<unknown> {
    const result = await this.prisma.inventoryItem.deleteMany({ where: { id: { in: ids } } });
    this.realtime.emitInventoryRefresh({ ids, deleted: true });
    return result;
  }

  async exportRows(): Promise<unknown[]> {
    return [];
  }
}