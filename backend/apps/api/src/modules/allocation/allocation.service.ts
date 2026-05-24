import { Injectable, BadRequestException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getCapitalAllocation(): Promise<any> {
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
        where: { quantity: { gt: 0 } },
        select: {
          id: true,
          totalCost: true,
          quantity: true,
          createdAt: true,
          expectedSalePriceManual: true,
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

    // Калькуляція ризиків ліквідності: шукаємо заморожені активи (старші за 45 днів)
    let stagnantCapital = 0;
    const stagnantItems: any[] = [];
    const now = Date.now();
    const STAGNANT_THRESHOLD = 45 * 24 * 60 * 60 * 1000; // 45 днів

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

      // Перевірка на заморожений капітал
      const age = now - new Date(item.createdAt).getTime();
      if (age > STAGNANT_THRESHOLD) {
        stagnantCapital += Number(item.totalCost);
        stagnantItems.push({
          id: item.id,
          title: item.titleSnapshot,
          cost: item.totalCost,
          ageDays: Math.floor(age / (24 * 60 * 60 * 1000)),
        });
      }
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
      stagnantCapital: toMoney(stagnantCapital),
      stagnantItems,
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
      byThemeRatio: Array.from(byTheme.entries()).map(([theme, value]) => ({
        theme,
        ratio: inventoryCost > 0 ? toMoney((value.cost / inventoryCost) * 100) : 0,
      })),
    };
  }

  async getCashflowPlan(params?: { monthlyBudget?: number; reinvestPercent?: number }): Promise<any> {
    const monthlyBudget = params?.monthlyBudget ?? 50000; // Підвищили капітал по дефолту
    const reinvestPercent = params?.reinvestPercent ?? 85;

    const stats = await this.getCapitalAllocation();

    const reinvestAmount = toMoney((monthlyBudget * reinvestPercent) / 100);
    const reserveAmount = toMoney(monthlyBudget - reinvestAmount);

    const averageItemCost = stats.inventoryCount > 0 ? stats.inventoryCost / stats.inventoryCount : 1500;
    const estimatedNewItems = Math.floor(reinvestAmount / averageItemCost);

    // Розрахунок індексу реінвестування
    const liquidityPressureIndex = stats.stagnantCapital > 0 
      ? toMoney((stats.stagnantCapital / stats.inventoryCost) * 100) 
      : 0;

    return {
      monthlyBudget,
      reinvestPercent,
      reinvestAmount,
      reserveAmount,
      averageItemCost: toMoney(averageItemCost),
      estimatedNewItems,
      liquidityPressureIndex,
      actionRequired: liquidityPressureIndex > 30 ? 'LIQUIDATE_STAGNANT' : 'OPTIMAL_ROUTING',
      currentInventoryCost: stats.inventoryCost,
      committedProcurementCost: stats.committedProcurementCost,
      capitalAtWork: stats.capitalAtWork,
      currentExpectedValue: stats.inventoryExpectedValue,
      currentUnrealizedProfit: stats.unrealizedProfit,
      stagnantCapital: stats.stagnantCapital,
      realizedProfit: stats.realizedProfit,
    };
  }
}