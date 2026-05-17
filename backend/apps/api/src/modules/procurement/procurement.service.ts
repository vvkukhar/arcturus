import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { ReceivePurchaseOrderDto } from './dto/receive-purchase-order.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class ProcurementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  private totalCost(params: { actualPrice?: number | null; plannedPrice?: number | null; shippingPrice?: number | null }): number | null {
    const base = params.actualPrice ?? params.plannedPrice;
    if (base == null) return null;
    return toMoney(Number(base) + Number(params.shippingPrice ?? 0));
  }

  async list(params?: { status?: string; q?: string; assignedUserId?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();
    return this.prisma.purchaseOrder.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(params?.assignedUserId ? { assignedUserId: params.assignedUserId } : {}),
        ...(q ? { OR: [{ titleSnapshot: { contains: q, mode: 'insensitive' } }, { supplierName: { contains: q, mode: 'insensitive' } }, { sourceCode: { contains: q, mode: 'insensitive' } }] } : {}),
      },
      include: { item: true, watchlistItem: true, inventoryItem: true, assignedUser: true },
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 10000,
    });
  }

  async getById(id: string): Promise<unknown> {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        item: true,
        watchlistItem: true,
        inventoryItem: { include: { images: true, location: { include: { warehouse: true } } } },
        assignedUser: true,
      },
    });

    if (!order) throw new NotFoundException('Purchase order not found');
    return order;
  }

  async create(dto: CreatePurchaseOrderDto): Promise<unknown> {
    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Item not found');

    if (dto.watchlistItemId) {
      const watchlist = await this.prisma.watchlistItem.findUnique({ where: { id: dto.watchlistItemId } });
      if (!watchlist) throw new NotFoundException('Watchlist item not found');
    }

    if (dto.assignedUserId) {
      const user = await this.prisma.user.findUnique({ where: { id: dto.assignedUserId } });
      if (!user) throw new NotFoundException('Assigned user not found');
    }

    const actualPrice = dto.actualPrice != null ? toMoney(dto.actualPrice) : null;
    const plannedPrice = dto.plannedPrice != null ? toMoney(dto.plannedPrice) : null;
    const shippingPrice = dto.shippingPrice != null ? toMoney(dto.shippingPrice) : null;

    const created = await this.prisma.purchaseOrder.create({
      data: {
        itemId: dto.itemId,
        watchlistItemId: dto.watchlistItemId ?? null,
        assignedUserId: dto.assignedUserId ?? null,
        titleSnapshot: dto.titleSnapshot || item.title,
        sourceCode: dto.sourceCode ?? null,
        supplierName: dto.supplierName ?? null,
        sourceUrl: dto.sourceUrl ?? null,
        status: 'planned',
        plannedPrice,
        actualPrice,
        shippingPrice,
        totalCost: this.totalCost({ actualPrice, plannedPrice, shippingPrice }),
        targetSellPrice: dto.targetSellPrice != null ? toMoney(dto.targetSellPrice) : null,
        quantity: dto.quantity ?? 1,
        condition: dto.condition ?? item.conditionDefault ?? 'used',
        sealed: dto.sealed ?? false,
        notes: dto.notes ?? null,
      },
      include: { item: true, watchlistItem: true, assignedUser: true },
    });

    await this.activity.log('purchase_order.created', { purchaseOrderId: created.id, itemId: created.itemId, title: created.titleSnapshot });

    if (created.assignedUserId) {
      await this.notifications.create({
        title: 'Purchase order assigned',
        message: created.titleSnapshot,
        type: 'purchase_order',
        targetUserId: created.assignedUserId,
        payloadJson: { purchaseOrderId: created.id },
      });
    }

    this.realtime.emitCustom('purchase_order.created', created);
    this.realtime.emitDashboardRefresh('purchase_order_created');

    return created;
  }

  async createFromWatchlist(watchlistItemId: string): Promise<unknown> {
    const watchlist = await this.prisma.watchlistItem.findUnique({
      where: { id: watchlistItemId },
      include: { item: true, assignedUser: true },
    });

    if (!watchlist) throw new NotFoundException('Watchlist item not found');

    const existing = await this.prisma.purchaseOrder.findFirst({
      where: { watchlistItemId, status: { in: ['planned', 'approved', 'ordered', 'paid', 'received'] } },
    });

    if (existing) return this.getById(existing.id);

    return this.create({
      itemId: watchlist.itemId,
      watchlistItemId: watchlist.id,
      assignedUserId: watchlist.assignedUserId ?? null,
      titleSnapshot: watchlist.titleSnapshot,
      plannedPrice: watchlist.maxBuyPrice,
      targetSellPrice: watchlist.targetSellPrice ?? null,
      quantity: 1,
      condition: watchlist.item.conditionDefault ?? 'used',
    });
  }

  async update(dto: UpdatePurchaseOrderDto): Promise<unknown> {
    const existing = await this.prisma.purchaseOrder.findUnique({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Purchase order not found');

    const actualPrice = dto.actualPrice === undefined ? existing.actualPrice : dto.actualPrice === null ? null : toMoney(dto.actualPrice);
    const plannedPrice = dto.plannedPrice === undefined ? existing.plannedPrice : dto.plannedPrice === null ? null : toMoney(dto.plannedPrice);
    const shippingPrice = dto.shippingPrice === undefined ? existing.shippingPrice : dto.shippingPrice === null ? null : toMoney(dto.shippingPrice);

    const updated = await this.prisma.purchaseOrder.update({
      where: { id: dto.id },
      data: {
        status: dto.status,
        assignedUserId: dto.assignedUserId,
        supplierName: dto.supplierName,
        sourceUrl: dto.sourceUrl,
        plannedPrice,
        actualPrice,
        shippingPrice,
        totalCost: this.totalCost({ actualPrice, plannedPrice, shippingPrice }),
        targetSellPrice: dto.targetSellPrice === undefined ? undefined : dto.targetSellPrice === null ? null : toMoney(dto.targetSellPrice),
        quantity: dto.quantity,
        condition: dto.condition,
        sealed: dto.sealed,
        notes: dto.notes,
        purchasedAt: dto.status === 'ordered' || dto.status === 'paid' ? existing.purchasedAt ?? new Date() : undefined,
      },
      include: { item: true, watchlistItem: true, inventoryItem: true, assignedUser: true },
    });

    await this.activity.log('purchase_order.updated', { purchaseOrderId: updated.id, status: updated.status });
    this.realtime.emitCustom('purchase_order.updated', updated);
    this.realtime.emitDashboardRefresh('purchase_order_updated');

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<unknown> {
    return this.update({ id, status });
  }

  async receive(dto: ReceivePurchaseOrderDto): Promise<unknown> {
    const order = await this.prisma.purchaseOrder.findUnique({
      where: { id: dto.id },
      include: { item: true },
    });

    if (!order) throw new NotFoundException('Purchase order not found');
    if (order.inventoryItemId) return this.getById(order.id);

    const location = dto.storageLocationId
      ? await this.prisma.storageLocation.findUnique({ where: { id: dto.storageLocationId }, include: { warehouse: true } })
      : null;

    if (dto.storageLocationId && !location) throw new NotFoundException('Storage location not found');

    const cost = order.totalCost ?? order.actualPrice ?? order.plannedPrice;
    if (cost == null || cost <= 0) throw new BadRequestException('Purchase order has no valid cost');

    const result = await this.prisma.$transaction(async (tx) => {
      const inventory = await tx.inventoryItem.create({
        data: {
          itemId: order.itemId,
          titleSnapshot: order.titleSnapshot,
          purchasePrice: toMoney(order.actualPrice ?? order.plannedPrice ?? cost),
          totalCost: toMoney(cost),
          quantity: order.quantity,
          condition: order.condition,
          sealed: order.sealed,
          expectedSalePriceManual: order.targetSellPrice,
          source: order.sourceCode,
          purchaseUrl: order.sourceUrl,
          storageLocationId: location?.id ?? null,
          warehouseId: location?.warehouseId ?? dto.warehouseId ?? null,
          storageLocation: location?.name ?? null,
          notes: order.notes,
          assignedUserId: order.assignedUserId,
          priority: 60,
        },
      });

      await tx.stockMovement.create({
        data: {
          inventoryItemId: inventory.id,
          warehouseId: location?.warehouseId ?? dto.warehouseId ?? null,
          fromStorageLocationId: null,
          toStorageLocationId: location?.id ?? null,
          type: 'purchase_receive',
          quantity: order.quantity,
          reason: `Received purchase order ${order.id}`,
        },
      });

      const updatedOrder = await tx.purchaseOrder.update({
        where: { id: order.id },
        data: { inventoryItemId: inventory.id, status: 'received', receivedAt: new Date() },
        include: { item: true, watchlistItem: true, inventoryItem: true, assignedUser: true },
      });

      return { inventory, purchaseOrder: updatedOrder };
    });

    await this.activity.log('purchase_order.received', { purchaseOrderId: order.id, inventoryItemId: result.inventory.id });
    this.realtime.emitCustom('purchase_order.received', result.purchaseOrder);
    this.realtime.emitInventoryRefresh({ inventoryItemId: result.inventory.id, reason: 'purchase_order_received' });
    this.realtime.emitDashboardRefresh('purchase_order_received');

    return result.purchaseOrder;
  }

  async board(): Promise<{ planned: unknown[]; approved: unknown[]; ordered: unknown[]; paid: unknown[]; received: unknown[]; cancelled: unknown[]; }> {
    const orders = await this.prisma.purchaseOrder.findMany({
      include: { item: true, watchlistItem: true, inventoryItem: true, assignedUser: true },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });

    return {
      planned: orders.filter((order) => order.status === 'planned'),
      approved: orders.filter((order) => order.status === 'approved'),
      ordered: orders.filter((order) => order.status === 'ordered'),
      paid: orders.filter((order) => order.status === 'paid'),
      received: orders.filter((order) => order.status === 'received'),
      cancelled: orders.filter((order) => order.status === 'cancelled'),
    };
  }

  async stats(): Promise<unknown> {
    const agg = await this.prisma.purchaseOrder.groupBy({
      by: ['status'],
      _count: true,
      _sum: { totalCost: true, actualPrice: true, plannedPrice: true }
    });

    const total = agg.reduce((sum, a) => sum + a._count, 0);
    const getCount = (status: string) => agg.find(a => a.status === status)?._count ?? 0;
    
    const openStatus = ['planned', 'approved', 'ordered', 'paid'];
    const openCost = agg.filter(a => openStatus.includes(a.status)).reduce((sum, a) => sum + Number(a._sum.totalCost ?? a._sum.plannedPrice ?? 0), 0);
    const receivedCost = agg.filter(a => a.status === 'received').reduce((sum, a) => sum + Number(a._sum.totalCost ?? 0), 0);

    return {
      total,
      planned: getCount('planned'),
      approved: getCount('approved'),
      ordered: getCount('ordered'),
      paid: getCount('paid'),
      received: getCount('received'),
      cancelled: getCount('cancelled'),
      openCost: toMoney(openCost),
      receivedCost: toMoney(receivedCost),
    };
  }
}