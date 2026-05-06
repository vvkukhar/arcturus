import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class SalesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async registerSale(params: {
    inventoryItemId: string;
    sellPrice: number;
    quantity?: number;
    channel?: string | null;
    buyerName?: string | null;
    notes?: string | null;
  }): Promise<unknown> {
    const quantity = params.quantity ?? 1;

    if (!params.inventoryItemId) {
      throw new BadRequestException('inventoryItemId is required');
    }

    if (!Number.isFinite(params.sellPrice) || params.sellPrice <= 0) {
      throw new BadRequestException('sellPrice must be positive');
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('quantity must be positive integer');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: params.inventoryItemId },
      include: { item: true, assignedUser: true },
    });

    if (!inventoryItem) throw new NotFoundException('Inventory item not found');

    if (inventoryItem.quantity < quantity) {
      throw new BadRequestException('Not enough quantity in inventory');
    }

    const unitCost = inventoryItem.quantity > 0 ? inventoryItem.totalCost / inventoryItem.quantity : inventoryItem.totalCost;
    const costBasis = toMoney(unitCost * quantity);
    const sellPrice = toMoney(params.sellPrice);
    const profit = calculateProfit({ revenue: sellPrice, cost: costBasis });
    const roiPercent = calculateRoiPercent({ profit, cost: costBasis });

    const result = await this.prisma.$transaction(async (tx) => {
      const sale = await tx.sale.create({
        data: {
          inventoryItemId: params.inventoryItemId,
          itemId: inventoryItem.itemId,
          quantity,
          sellPrice,
          costBasis,
          profit,
          roiPercent,
          channel: params.channel ?? null,
          buyerName: params.buyerName ?? null,
          notes: params.notes ?? null,
        },
        include: {
          inventoryItem: { include: { item: true, assignedUser: true } },
          item: true,
        },
      });

      await tx.inventoryItem.update({
        where: { id: params.inventoryItemId },
        data: { quantity: { decrement: quantity } },
      });

      await tx.stockMovement.create({
        data: {
          inventoryItemId: params.inventoryItemId,
          warehouseId: inventoryItem.warehouseId ?? null,
          fromStorageLocationId: inventoryItem.storageLocationId ?? null,
          toStorageLocationId: null,
          type: 'sale',
          quantity,
          reason: `Sale ${sale.id}`,
        },
      });

      return sale;
    });

    await this.activity.log('sale.registered', {
      saleId: result.id,
      inventoryItemId: params.inventoryItemId,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
      sellPrice,
      costBasis,
      profit,
      roiPercent,
      quantity,
    });

    await this.notifications.createSaleNotification({
      itemTitle: inventoryItem.titleSnapshot,
      profit,
      targetUserId: inventoryItem.assignedUserId ?? null,
    });

    this.realtime.emitSaleRegistered({
      id: result.id,
      title: inventoryItem.titleSnapshot,
      profit,
      sellPrice,
      quantity,
    });

    this.realtime.emitInventoryRefresh({ inventoryItemId: params.inventoryItemId, reason: 'sale_registered' });
    this.realtime.emitDashboardRefresh('sale_registered');
    this.realtime.emitOpportunityRefresh('sale_registered');

    return result;
  }

  async list(params?: { q?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.sale.findMany({
      where: {
        ...(q
          ? {
              OR: [
                { inventoryItem: { titleSnapshot: { contains: q, mode: 'insensitive' } } },
                { item: { title: { contains: q, mode: 'insensitive' } } },
                { buyerName: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        inventoryItem: { include: { item: true } },
        item: true,
        orders: true,
        returns: true,
        expenses: true,
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 100,
    });
  }

  async stats(): Promise<unknown> {
    const [sales, returns, expenses] = await Promise.all([
      this.prisma.sale.findMany(),
      this.prisma.returnRequest.findMany(),
      this.prisma.expense.findMany(),
    ]);

    const totalRefunds = toMoney(
      returns
        .filter((row) => ['approved', 'resolved'].includes(row.status))
        .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
    );

    const totalExpenses = toMoney(expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0));
    
    const returnedSalesIds = new Set(
      returns.filter((row) => ['approved', 'resolved'].includes(row.status)).map((row) => row.saleId),
    );

    const grossProfit = toMoney(sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0));
    const grossRevenue = toMoney(sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0));
    const totalCostBasis = toMoney(sales.reduce((sum, sale) => sum + Number(sale.costBasis ?? 0), 0));
    const unitsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    const avgRoi = sales.length > 0
      ? toMoney(sales.reduce((sum, sale) => sum + Number(sale.roiPercent ?? 0), 0) / sales.length)
      : 0;

    const netProfitBeforeExpenses = toMoney(grossProfit - totalRefunds);

    return {
      grossProfit,
      netProfitBeforeExpenses,
      netProfit: toMoney(netProfitBeforeExpenses - totalExpenses),
      grossRevenue,
      netRevenue: toMoney(grossRevenue - totalRefunds),
      totalRefunds,
      totalExpenses,
      totalCostBasis,
      salesCount: sales.length,
      returnedSalesCount: returnedSalesIds.size,
      unitsSold,
      avgRoi,
    };
  }

  async deleteSale(id: string): Promise<unknown> {
    const existing = await this.prisma.sale.findUnique({
      where: { id },
      include: {
        returns: true,
        expenses: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Sale not found');
    }

    if (existing.returns.length > 0) {
      throw new BadRequestException('Cannot delete sale with active return requests');
    }

    if (existing.expenses.length > 0) {
      throw new BadRequestException('Cannot delete sale with active linked expenses');
    }

    const deleted = await this.prisma.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: existing.inventoryItemId },
        data: { quantity: { increment: existing.quantity } },
      });

      await tx.stockMovement.create({
        data: {
          inventoryItemId: existing.inventoryItemId,
          warehouseId: null,
          fromStorageLocationId: null,
          toStorageLocationId: null,
          type: 'sale_deleted_restore',
          quantity: existing.quantity,
          reason: `Sale soft deleted ${existing.id}`,
        },
      });

      return tx.sale.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    });

    await this.activity.log('sale.deleted', {
      saleId: id,
      inventoryItemId: existing.inventoryItemId,
      quantityRestored: existing.quantity,
    });

    this.realtime.emitInventoryRefresh({ inventoryItemId: existing.inventoryItemId, reason: 'sale_deleted' });
    this.realtime.emitDashboardRefresh('sale_deleted');

    return deleted;
  }
}