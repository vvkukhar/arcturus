import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '../../common/money.utils';

@Injectable()
export class CapitalService {
  constructor(private readonly prisma: PrismaService) {}

  async getSnapshot(): Promise<unknown> {
    const [inventory, watchlist, sales] = await Promise.all([
      this.prisma.inventoryItem.findMany(),
      this.prisma.watchlistItem.findMany({
        where: {
          active: true,
        },
      }),
      this.prisma.sale.findMany(),
    ]);

    const lockedInInventory = toMoney(
      inventory.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0),
    );

    const expectedInventoryExit = toMoney(
      inventory.reduce(
        (sum, item) =>
          sum +
          Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
            Number(item.quantity ?? 0),
        0,
      ),
    );

    const realizedProfit = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
    );

    const watchlistDemand = toMoney(
      watchlist.reduce((sum, item) => sum + Number(item.maxBuyPrice ?? 0), 0),
    );

    return {
      lockedInInventory,
      expectedInventoryExit,
      expectedUnrealizedProfit: toMoney(expectedInventoryExit - lockedInInventory),
      realizedProfit,
      watchlistDemand,
      activeWatchlistItems: watchlist.length,
      activeInventoryItems: inventory.length,
    };
  }

  async simulate(params: {
    capital: number;
    maxItems: number;
  }): Promise<unknown> {
    const watchlist = await this.prisma.watchlistItem.findMany({
      where: {
        active: true,
      },
      orderBy: {
        priority: 'desc',
      },
      include: {
        item: true,
      },
    });

    let remaining = toMoney(params.capital);
    const selected = [];

    for (const item of watchlist) {
      if (selected.length >= params.maxItems) {
        break;
      }

      const buyPrice = Number(item.maxBuyPrice ?? 0);
      const targetSell = Number(item.targetSellPrice ?? 0);
      const profit = toMoney(targetSell - buyPrice);
      const roi = buyPrice > 0 ? Number(((profit / buyPrice) * 100).toFixed(2)) : 0;

      if (buyPrice <= 0 || targetSell <= 0 || buyPrice > remaining) {
        continue;
      }

      if (roi < 15 || profit < 80) {
        continue;
      }

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
      projectedProfit: toMoney(
        selected.reduce((sum, item) => sum + item.profit, 0),
      ),
    };
  }
}