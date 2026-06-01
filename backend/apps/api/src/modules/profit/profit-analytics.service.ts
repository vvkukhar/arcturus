// call:function_1{"queries":["backend/apps/api/src/modules/profit/profit-analytics.service.ts"]}
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';

@Injectable()
export class ProfitAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<unknown> {
    const [salesAgg, recentSales, bestSaleRaw] = await Promise.all([
      this.prisma.sale.aggregate({
        _count: { _all: true },
        _sum: { sellPrice: true, profit: true },
      }),
      this.prisma.sale.findMany({
        include: { inventoryItem: { include: { item: true } } },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.sale.findFirst({
        orderBy: { profit: 'desc' },
        include: { inventoryItem: { include: { item: true } } },
      })
    ]);

    const activeInventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      select: { totalCost: true, expectedSalePriceManual: true, quantity: true }
    });

    let invCost = 0;
    let invRev = 0;
    for (const item of activeInventory) {
        invCost += Number(item.totalCost) * item.quantity;
        invRev += Number(item.expectedSalePriceManual ?? item.totalCost) * item.quantity;
    }

    const totalRevenue = toMoney(salesAgg._sum.sellPrice ?? 0);
    const totalProfit = toMoney(salesAgg._sum.profit ?? 0);
    const salesCount = salesAgg._count._all;

    const avgProfitPerSale = salesCount > 0 ? toMoney(totalProfit / salesCount) : 0;
    const avgRevenue = salesCount > 0 ? toMoney(totalRevenue / salesCount) : 0;

    const realizedRoiPercent = calculateRoiPercent({ profit: totalProfit, cost: Math.max(1, totalRevenue - totalProfit) });
    
    const inventoryCostBasis = toMoney(invCost);
    const expectedInventoryRevenue = toMoney(invRev);
    const expectedInventoryProfit = calculateProfit({ revenue: expectedInventoryRevenue, cost: inventoryCostBasis });

    return {
      salesCount,
      totalRevenue,
      totalProfit,
      avgProfitPerSale,
      avgRevenue,
      realizedRoiPercent,
      inventoryCostBasis,
      expectedInventoryRevenue,
      expectedInventoryProfit,
      expectedInventoryRoiPercent: calculateRoiPercent({ profit: expectedInventoryProfit, cost: inventoryCostBasis }),
      bestSale: bestSaleRaw ?? null,
      recentSales,
    };
  }

  async getMonthlyBreakdown(): Promise<unknown[]> {
    const salesData = await this.prisma.sale.findMany({
      select: { createdAt: true, sellPrice: true, profit: true },
      orderBy: { createdAt: 'asc' },
    });

    const map = new Map<string, { month: string; salesCount: number; revenue: number; profit: number }>();

    for (const sale of salesData) {
      const date = sale.createdAt;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      const current = map.get(month) ?? { month, salesCount: 0, revenue: 0, profit: 0 };
      current.salesCount += 1;
      current.revenue += Number(sale.sellPrice ?? 0);
      current.profit += Number(sale.profit ?? 0);

      map.set(month, current);
    }

    return [...map.values()].map((row) => ({
      ...row,
      revenue: toMoney(row.revenue),
      profit: toMoney(row.profit),
      avgProfit: row.salesCount > 0 ? toMoney(row.profit / row.salesCount) : 0,
    }));
  }

  async getSalesVelocity(days = 30): Promise<unknown> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [salesCount, inventoryAgg] = await Promise.all([
      this.prisma.sale.count({
        where: { createdAt: { gte: since } },
      }),
      this.prisma.inventoryItem.aggregate({
        _sum: { quantity: true },
      }),
    ]);

    const activeUnits = inventoryAgg._sum.quantity ?? 0;
    const soldPerDay = days > 0 ? salesCount / days : 0;
    const estimatedDaysToClear = soldPerDay > 0 ? Math.ceil(activeUnits / soldPerDay) : null;

    return {
      windowDays: days,
      unitsSold: salesCount,
      activeUnits,
      soldPerDay: Number(soldPerDay.toFixed(2)),
      estimatedDaysToClear,
      velocityTier: soldPerDay >= 2 ? 'fast' : soldPerDay >= 0.5 ? 'medium' : 'slow',
    };
  }

  async getProfitByTheme(): Promise<unknown[]> {
    const sales = await this.prisma.sale.findMany({
      select: { profit: true, item: { select: { theme: true } } },
    });
    
    const map = new Map<string, number>();
    for (const sale of sales) {
      const theme = sale.item?.theme ?? 'Unknown';
      map.set(theme, (map.get(theme) ?? 0) + Number(sale.profit ?? 0));
    }
    
    return Array.from(map.entries())
      .map(([theme, profit]) => ({ theme, profit: toMoney(profit) }))
      .sort((a, b) => b.profit - a.profit);
  }
}