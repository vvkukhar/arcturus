import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney, calculateProfit, calculateRoiPercent } from '@arcturus/shared';
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
    skipStockDeduction?: boolean;
  }): Promise<unknown> {
    const quantity = params.quantity ?? 1;

    if (!params.inventoryItemId) throw new BadRequestException('inventoryItemId is required');
    if (!Number.isFinite(params.sellPrice) || params.sellPrice <= 0) throw new BadRequestException('sellPrice must be positive');
    if (!Number.isInteger(quantity) || quantity <= 0) throw new BadRequestException('quantity must be positive integer');

    return this.prisma.$transaction(async (tx) => {
      const inventoryItem = await tx.inventoryItem.findUnique({
        where: { id: params.inventoryItemId }
      });

      if (!inventoryItem) throw new NotFoundException('Inventory item not found');
      
      if (!params.skipStockDeduction) {
        if (inventoryItem.quantity < quantity) {
          throw new BadRequestException('Not enough quantity in inventory');
        }
        await tx.inventoryItem.update({
          where: { id: params.inventoryItemId },
          data: { quantity: { decrement: quantity } },
        });
      }

      const unitCost = inventoryItem.quantity > 0 ? Number(inventoryItem.totalCost) / inventoryItem.quantity : Number(inventoryItem.totalCost);
      let costBasis = toMoney(unitCost * quantity);
      const sellPrice = toMoney(params.sellPrice);
      let profit = calculateProfit({ revenue: sellPrice, cost: costBasis });
      let roiPercent = calculateRoiPercent({ profit, cost: costBasis });

      let commissionAmount = null;
      let sellerPayout = null;

      if (inventoryItem.isMarketplace) {
        commissionAmount = toMoney((sellPrice * inventoryItem.commissionRate) / 100);
        sellerPayout = toMoney(sellPrice - commissionAmount);
        costBasis = sellerPayout; 
        profit = commissionAmount; 
        roiPercent = 100;
      }

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
          isMarketplaceSale: inventoryItem.isMarketplace,
          commissionAmount,
          sellerPayout,
          payoutStatus: inventoryItem.isMarketplace ? 'pending' : 'paid',
        },
        include: {
          inventoryItem: { include: { item: true, assignedUser: true } },
          item: true,
        },
      });

      if (inventoryItem.investorId && inventoryItem.investorProfitShare) {
        const investorProfit = toMoney(profit * inventoryItem.investorProfitShare);
        const totalReturn = costBasis + investorProfit;
        
        await tx.user.update({
          where: { id: inventoryItem.investorId },
          data: { vaultBalance: { increment: totalReturn } }
        });

        await tx.vaultTransaction.create({
          data: {
            userId: inventoryItem.investorId,
            amount: totalReturn,
            type: 'return',
            description: `Sale return & profit share: ${inventoryItem.titleSnapshot}`
          }
        });
      }

      await tx.stockMovement.create({
        data: {
          inventoryItemId: params.inventoryItemId,
          warehouseId: inventoryItem.warehouseId,
          fromStorageLocationId: inventoryItem.storageLocationId,
          toStorageLocationId: null,
          type: 'sale',
          quantity,
          reason: `Sale ${sale.id}`,
        },
      });

      return sale;
    });
  }

  async getPendingPayouts(): Promise<unknown[]> {
    return this.prisma.payoutRequest.findMany({
      where: { status: 'pending' },
      include: { seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async markPayoutPaid(payoutRequestId: string): Promise<unknown> {
    const request = await this.prisma.payoutRequest.findUnique({
      where: { id: payoutRequestId },
      include: { seller: true }
    });

    if (!request) throw new NotFoundException('Payout request not found');

    const updated = await this.prisma.payoutRequest.update({
      where: { id: payoutRequestId },
      data: { status: 'paid', updatedAt: new Date() }
    });

    await this.notifications.create({
      title: 'Виплату виконано!',
      message: `Ваш вивід коштів у розмірі ${updated.amount} ₴ успішно оброблено.`,
      type: 'payment',
      targetUserId: updated.sellerId,
    });

    return updated;
  }

  async list(params?: { q?: string; limit?: number; offset?: number }): Promise<unknown[]> {
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
      take: params?.limit ?? 50,
      skip: params?.offset ?? 0,
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
      unitsSold,
      avgRoi,
    };
  }

  async deleteSale(id: string): Promise<unknown> {
    const existing = await this.prisma.sale.findUnique({
      where: { id },
      include: { returns: true, expenses: true },
    });

    if (!existing) throw new NotFoundException('Sale not found');
    if (existing.returns.length > 0) throw new BadRequestException('Cannot delete sale with active returns');
    if (existing.expenses.length > 0) throw new BadRequestException('Cannot delete sale with linked expenses');

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

    await this.activity.log('sale.deleted', { saleId: id, inventoryItemId: existing.inventoryItemId, quantityRestored: existing.quantity });
    this.realtime.emitInventoryRefresh({ inventoryItemId: existing.inventoryItemId, reason: 'sale_deleted' });
    this.realtime.emitDashboardRefresh('sale_deleted');

    return deleted;
  }
}