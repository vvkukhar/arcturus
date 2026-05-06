import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class InventoryStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<unknown> {
    const [agg, themeData] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _count: { _all: true },
        _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true },
      }),
      this.prisma.inventoryItem.findMany({
        select: {
          totalCost: true,
          quantity: true,
          expectedSalePriceManual: true,
          item: { select: { theme: true } },
        }
      })
    ]);

    const totalItems = agg._count._all;
    const totalUnits = agg._sum.quantity ?? 0;
    const totalCost = toMoney(agg._sum.totalCost ?? 0);

    const availableItems = themeData.filter(i => i.quantity > 0).length;
    const outOfStockItems = totalItems - availableItems;

    let expectedRevenueRaw = 0;
    const byTheme = new Map<string, { theme: string; items: number; units: number; cost: number; expectedRevenue: number }>();

    for (const row of themeData) {
      const rev = Number(row.expectedSalePriceManual ?? row.totalCost ?? 0) * row.quantity;
      expectedRevenueRaw += rev;
      
      const theme = row.item?.theme ?? 'Unknown';
      const current = byTheme.get(theme) ?? { theme, items: 0, units: 0, cost: 0, expectedRevenue: 0 };

      current.items += 1;
      current.units += row.quantity;
      current.cost += Number(row.totalCost ?? 0);
      current.expectedRevenue += rev;

      byTheme.set(theme, current);
    }

    const expectedRevenue = toMoney(expectedRevenueRaw);

    return {
      totalItems,
      totalUnits,
      availableItems,
      outOfStockItems,
      totalCost,
      expectedRevenue,
      expectedProfit: toMoney(expectedRevenue - totalCost),
      byTheme: [...byTheme.values()]
        .map((row) => ({
          ...row,
          cost: toMoney(row.cost),
          expectedRevenue: toMoney(row.expectedRevenue),
          expectedProfit: toMoney(row.expectedRevenue - row.cost),
        }))
        .sort((a, b) => b.expectedRevenue - a.expectedRevenue),
    };
  }
}