import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class CapitalService {
  constructor(private readonly prisma: PrismaService) {}

  async getSnapshot(): Promise<unknown> {
    const [inventoryAgg, watchlistAgg, salesAgg] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true }
      }),
      this.prisma.watchlistItem.aggregate({
        where: { active: true },
        _count: { _all: true },
        _sum: { maxBuyPrice: true }
      }),
      this.prisma.sale.aggregate({
        _sum: { profit: true }
      }),
    ]);

    const lockedInInventory = toMoney(inventoryAgg._sum.totalCost ?? 0);
    const expectedInventoryExit = toMoney(inventoryAgg._sum.expectedSalePriceManual ?? inventoryAgg._sum.totalCost ?? 0);
    const realizedProfit = toMoney(salesAgg._sum.profit ?? 0);
    const watchlistDemand = toMoney(watchlistAgg._sum.maxBuyPrice ?? 0);

    return {
      lockedInInventory,
      expectedInventoryExit,
      expectedUnrealizedProfit: toMoney(expectedInventoryExit - lockedInInventory),
      realizedProfit,
      watchlistDemand,
      activeWatchlistItems: watchlistAgg._count._all,
      activeInventoryItems: inventoryAgg._sum.quantity ?? 0,
    };
  }

  async simulate(params: { capital: number; maxItems: number }): Promise<unknown> {
    const watchlist = await this.prisma.watchlistItem.findMany({
      where: { active: true },
      orderBy: { priority: 'desc' },
      include: { item: true },
    });

    let remaining = toMoney(params.capital);
    const selected = [];

    for (const item of watchlist) {
      if (selected.length >= params.maxItems) break;

      const buyPrice = Number(item.maxBuyPrice ?? 0);
      const targetSell = Number(item.targetSellPrice ?? 0);
      const profit = toMoney(targetSell - buyPrice);
      const roi = buyPrice > 0 ? Number(((profit / buyPrice) * 100).toFixed(2)) : 0;

      if (buyPrice <= 0 || targetSell <= 0 || buyPrice > remaining) continue;
      if (roi < 15 || profit < 80) continue;

      selected.push({
        watchlistItemId: item.id,
        itemId: item.itemId,
        title: item.titleSnapshot,
        buyPrice,
        targetSell,
        profit,
        roi,
      });

      remaining = toMoney(remaining - buyPrice);
    }

    return {
      capital: params.capital,
      selectedCount: selected.length,
      selected,
      usedCapital: toMoney(params.capital - remaining),
      remainingCapital: remaining,
      projectedProfit: toMoney(selected.reduce((sum, item) => sum + item.profit, 0)),
    };
  }
}