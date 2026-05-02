import { Injectable } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiService {
  constructor(private readonly prisma: PrismaService) {}

  explainDeal(params: {
    buyPrice: number;
    sellPrice: number;
    marketFloor?: number | null;
    marketAverage?: number | null;
    liquidityScore?: number | null;
  }): unknown {
    const buyPrice = toMoney(params.buyPrice);
    const sellPrice = toMoney(params.sellPrice);
    const profit = calculateProfit({
      revenue: sellPrice,
      cost: buyPrice,
    });

    const roi = calculateRoiPercent({
      profit,
      cost: buyPrice,
    });

    const reasons: string[] = [];

    if (roi >= 40) {
      reasons.push('ROI is strong enough for an aggressive flip.');
    } else if (roi >= 25) {
      reasons.push('ROI is acceptable but should be checked against liquidity.');
    } else {
      reasons.push('ROI is weak for LEGO resale unless the item is rare.');
    }

    if (params.marketFloor != null && buyPrice <= params.marketFloor * 0.85) {
      reasons.push('Buy price is meaningfully below the visible market floor.');
    }

    if (params.marketAverage != null && sellPrice <= params.marketAverage * 1.15) {
      reasons.push('Sell price is not wildly above market average.');
    }

    if ((params.liquidityScore ?? 0.5) >= 0.7) {
      reasons.push('Liquidity score supports faster conversion into cashflow.');
    } else {
      reasons.push('Liquidity is uncertain, so execution should be careful.');
    }

    let verdict = 'REVIEW';

    if (roi >= 40 && profit >= 250) {
      verdict = 'BUY_NOW';
    } else if (roi >= 25 && profit >= 120) {
      verdict = 'BUY';
    } else if (roi >= 15) {
      verdict = 'WATCH';
    }

    return {
      verdict,
      buyPrice,
      sellPrice,
      profit,
      roi,
      reasons,
    };
  }

  async suggestions(): Promise<unknown[]> {
    const [latestBuyDecisions, latestSellDecisions] = await Promise.all([
      this.prisma.decisionSnapshot.findMany({
        where: {
          contextType: 'watchlist',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: {
          contextType: 'inventory',
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      }),
    ]);

    const rows: unknown[] = [];

    for (const decision of latestBuyDecisions.slice(0, 10)) {
      const watchlist = await this.prisma.watchlistItem.findUnique({
        where: {
          id: decision.contextId,
        },
        include: {
          item: true,
        },
      });

      if (!watchlist) continue;

      rows.push({
        id: decision.id,
        type: 'buy',
        title: watchlist.titleSnapshot,
        score: decision.score,
        action: decision.action,
        suggestion: `${decision.reasonPrimary}. ${decision.reasonSecondary ?? ''}`.trim(),
      });
    }

    for (const decision of latestSellDecisions.slice(0, 10)) {
      const inventory = await this.prisma.inventoryItem.findUnique({
        where: {
          id: decision.contextId,
        },
        include: {
          item: true,
        },
      });

      if (!inventory) continue;

      rows.push({
        id: decision.id,
        type: 'sell',
        title: inventory.titleSnapshot,
        score: decision.score,
        action: decision.action,
        suggestion: `${decision.reasonPrimary}. ${decision.reasonSecondary ?? ''}`.trim(),
      });
    }

    return rows.sort((a: any, b: any) => b.score - a.score).slice(0, 20);
  }
}