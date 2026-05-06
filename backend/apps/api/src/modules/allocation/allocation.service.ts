import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getCapitalAllocation(): Promise<unknown> {
    const [
      inventoryAgg,
      salesAgg,
      returnsAgg,
      expensesAgg,
      watchlistAgg,
      poOpenAgg,
      poReceivedAgg,
      procurementGroups,
      returnGroups,
      expenseGroups,
      inventoryData,
    ] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _count: true,
        _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true },
      }),
      this.prisma.sale.aggregate({ _sum: { profit: true } }),
      this.prisma.returnRequest.aggregate({
        _sum: { refundAmount: true },
        where: { status: { in: ['approved', 'resolved'] } },
      }),
      this.prisma.expense.aggregate({ _sum: { amount: true } }),
      this.prisma.watchlistItem.aggregate({
        _sum: { maxBuyPrice: true },
        where: { active: true },
      }),
      this.prisma.purchaseOrder.aggregate({
        _sum: { totalCost: true, actualPrice: true, plannedPrice: true },
        where: { status: { in: ['planned', 'approved', 'ordered', 'paid'] } },
      }),
      this.prisma.purchaseOrder.aggregate({
        _sum: { totalCost: true },
        where: { status: 'received' },
      }),
      this.prisma.purchaseOrder.groupBy({
        by: ['status'],
        _count: true,
        _sum: { totalCost: true, actualPrice: true, plannedPrice: true },
      }),
      this.prisma.returnRequest.groupBy({
        by: ['status'],
        _count: true,
        _sum: { refundAmount: true },
      }),
      this.prisma.expense.groupBy({
        by: ['category'],
        _count: true,
        _sum: { amount: true },
      }),
      this.prisma.inventoryItem.findMany({
        select: {
          totalCost: true,
          quantity: true,
          item: { select: { theme: true } },
          location: { select: { warehouse: { select: { name: true } } } },
        },
      }),
    ]);

    const inventoryCost = toMoney(inventoryAgg._sum.totalCost ?? 0);
    const inventoryExpectedValue = toMoney(inventoryAgg._sum.expectedSalePriceManual ?? inventoryCost);
    const grossRealizedProfit = toMoney(salesAgg._sum.profit ?? 0);
    const refundAmount = toMoney(returnsAgg._sum.refundAmount ?? 0);
    const operatingExpenses = toMoney(expensesAgg._sum.amount ?? 0);
    const realizedProfit = toMoney(grossRealizedProfit - refundAmount - operatingExpenses);
    const activeBuyNeed = toMoney(watchlistAgg._sum.maxBuyPrice ?? 0);
    
    const committedProcurementCost = toMoney(
      poOpenAgg._sum.totalCost ?? poOpenAgg._sum.actualPrice ?? poOpenAgg._sum.plannedPrice ?? 0
    );
    const receivedProcurementCost = toMoney(poReceivedAgg._sum.totalCost ?? 0);

    const byTheme = new Map<string, { cost: number; count: number; units: number }>();
    const byWarehouse = new Map<string, { cost: number; count: number; units: number }>();

    for (const item of inventoryData) {
      const theme = item.item?.theme ?? 'Unknown';
      const tData = byTheme.get(theme) ?? { cost: 0, count: 0, units: 0 };
      tData.cost += Number(item.totalCost ?? 0);
      tData.count += 1;
      tData.units += item.quantity;
      byTheme.set(theme, tData);

      const warehouse = item.location?.warehouse?.name ?? 'Unassigned';
      const wData = byWarehouse.get(warehouse) ?? { cost: 0, count: 0, units: 0 };
      wData.cost += Number(item.totalCost ?? 0);
      wData.count += 1;
      wData.units += item.quantity;
      byWarehouse.set(warehouse, wData);
    }

    return {
      inventoryCost,
      inventoryExpectedValue,
      unrealizedProfit: toMoney(inventoryExpectedValue - inventoryCost),
      grossRealizedProfit,
      refundAmount,
      operatingExpenses,
      realizedProfit,
      activeBuyNeed,
      committedProcurementCost,
      receivedProcurementCost,
      capitalAtWork: toMoney(inventoryCost + committedProcurementCost),
      inventoryCount: inventoryAgg._count,
      inventoryUnits: inventoryAgg._sum.quantity ?? 0,
      byTheme: Array.from(byTheme.entries()).map(([theme, value]) => ({
        theme,
        cost: toMoney(value.cost),
        count: value.count,
        units: value.units,
      })),
      byWarehouse: Array.from(byWarehouse.entries()).map(([warehouse, value]) => ({
        warehouse,
        cost: toMoney(value.cost),
        count: value.count,
        units: value.units,
      })),
      byProcurementStatus: procurementGroups.map((group) => ({
        status: group.status,
        cost: toMoney(group._sum.totalCost ?? group._sum.actualPrice ?? group._sum.plannedPrice ?? 0),
        count: group._count,
      })),
      byReturnStatus: returnGroups.map((group) => ({
        status: group.status,
        refundAmount: toMoney(group._sum.refundAmount ?? 0),
        count: group._count,
      })),
      byExpenseCategory: expenseGroups.map((group) => ({
        category: group.category,
        amount: toMoney(group._sum.amount ?? 0),
        count: group._count,
      })),
    };
  }

  async getCashflowPlan(params?: { monthlyBudget?: number; reinvestPercent?: number }): Promise<unknown> {
    const monthlyBudget = params?.monthlyBudget ?? 17000;
    const reinvestPercent = params?.reinvestPercent ?? 80;

    const stats = (await this.getCapitalAllocation()) as any;

    const reinvestAmount = toMoney((monthlyBudget * reinvestPercent) / 100);
    const reserveAmount = toMoney(monthlyBudget - reinvestAmount);

    const averageItemCost = stats.inventoryCount > 0 ? stats.inventoryCost / stats.inventoryCount : 1000;
    const estimatedNewItems = Math.floor(reinvestAmount / averageItemCost);

    return {
      monthlyBudget,
      reinvestPercent,
      reinvestAmount,
      reserveAmount,
      averageItemCost: toMoney(averageItemCost),
      estimatedNewItems,
      currentInventoryCost: stats.inventoryCost,
      committedProcurementCost: stats.committedProcurementCost,
      capitalAtWork: stats.capitalAtWork,
      currentExpectedValue: stats.inventoryExpectedValue,
      currentUnrealizedProfit: stats.unrealizedProfit,
      grossRealizedProfit: stats.grossRealizedProfit,
      refundAmount: stats.refundAmount,
      operatingExpenses: stats.operatingExpenses,
      realizedProfit: stats.realizedProfit,
    };
  }
}