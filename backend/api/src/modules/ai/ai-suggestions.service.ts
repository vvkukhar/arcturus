import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';

@Injectable()
export class AiSuggestionsService {
  constructor(private readonly prisma: PrismaService) {}

  explainDeal(params: {
    title?: string;
    buyPrice?: number;
    targetSellPrice?: number;
    roiPercent?: number;
    profit?: number;
    score?: number;
  }): unknown {
    const roi = Number(params.roiPercent ?? 0);
    const profit = Number(params.profit ?? 0);
    const score = Number(params.score ?? 0);

    const strengths: string[] = [];
    const risks: string[] = [];

    if (roi >= 35) strengths.push('Strong ROI profile');
    else risks.push('ROI is below strong-flip threshold');

    if (profit >= 300) strengths.push('Good absolute profit');
    else risks.push('Profit may be too small after time and overhead');

    if (score >= 80) strengths.push('High engine score');
    else risks.push('Engine score is not decisive');

    return {
      title: params.title ?? 'Deal',
      verdict:
        score >= 85 || (roi >= 35 && profit >= 300)
          ? 'strong_candidate'
          : roi >= 20 && profit >= 150
            ? 'watch_or_negotiate'
            : 'weak_candidate',
      strengths,
      risks,
      summary:
        score >= 85 || (roi >= 35 && profit >= 300)
          ? 'This looks like a strong resale candidate.'
          : roi >= 20 && profit >= 150
            ? 'This may work, but negotiation or manual review is recommended.'
            : 'This deal is weak unless there is missing context.',
    };
  }

  async getSuggestions(): Promise<unknown[]> {
    const [inventory, watchlist, unresolved, staleSources] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        include: {
          item: true,
          assignedUser: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      }),
      this.prisma.watchlistItem.findMany({
        where: {
          active: true,
        },
        include: {
          item: true,
          assignedUser: true,
        },
        orderBy: {
          priority: 'desc',
        },
        take: 50,
      }),
      this.prisma.unresolvedMatchQueue.count({
        where: {
          status: 'pending',
        },
      }),
      this.getStaleSourceCount(),
    ]);

    const suggestions: Array<{
      id: string;
      type: string;
      title: string;
      suggestion: string;
      score: number;
    }> = [];

    for (const item of inventory) {
      const sell = toMoney(item.expectedSalePriceManual ?? 0);
      const profit = calculateProfit({
        revenue: sell,
        cost: item.totalCost,
      });
      const roi = calculateRoiPercent({
        profit,
        cost: item.totalCost,
      });

      if (sell <= 0) {
        suggestions.push({
          id: item.id,
          type: 'inventory',
          title: item.titleSnapshot,
          suggestion: 'Set manual sell price so repricer and storefront can act.',
          score: 72,
        });
        continue;
      }

      if (roi < 10) {
        suggestions.push({
          id: item.id,
          type: 'inventory',
          title: item.titleSnapshot,
          suggestion: 'Margin is weak. Review buy cost, price, or liquidation path.',
          score: 80,
        });
      } else if (roi >= 45 && item.quantity > 0) {
        suggestions.push({
          id: item.id,
          type: 'inventory',
          title: item.titleSnapshot,
          suggestion: 'Strong sell profile. Push into reprice/listing execution.',
          score: Math.min(95, roi),
        });
      }
    }

    for (const item of watchlist) {
      const target = toMoney(item.targetSellPrice ?? 0);
      const profit = calculateProfit({
        revenue: target,
        cost: item.maxBuyPrice,
      });
      const roi = calculateRoiPercent({
        profit,
        cost: item.maxBuyPrice,
      });

      if (target <= 0) {
        suggestions.push({
          id: item.id,
          type: 'watchlist',
          title: item.titleSnapshot,
          suggestion: 'Add target sell price to unlock buy scoring.',
          score: 70,
        });
      } else if (roi >= 40) {
        suggestions.push({
          id: item.id,
          type: 'watchlist',
          title: item.titleSnapshot,
          suggestion: 'High ROI watchlist target. Keep scanning and queue good entries.',
          score: Math.min(96, roi),
        });
      }
    }

    if (unresolved > 0) {
      suggestions.push({
        id: 'operator-unresolved',
        type: 'operator',
        title: 'Unresolved market matches',
        suggestion: `${unresolved} listings need operator resolution before intelligence is clean.`,
        score: 88,
      });
    }

    if (staleSources > 0) {
      suggestions.push({
        id: 'source-health',
        type: 'sync',
        title: 'Stale market sources',
        suggestion: `${staleSources} sources look stale. Refresh them before trusting opportunities.`,
        score: 84,
      });
    }

    return suggestions.sort((a, b) => b.score - a.score).slice(0, 20);
  }

  private async getStaleSourceCount(): Promise<number> {
    const sources = await this.prisma.marketSource.findMany({
      select: {
        id: true,
      },
    });

    let count = 0;

    for (const source of sources) {
      const latest = await this.prisma.marketListing.findFirst({
        where: {
          sourceId: source.id,
        },
        orderBy: {
          fetchedAt: 'desc',
        },
        select: {
          fetchedAt: true,
        },
      });

      if (!latest) {
        count += 1;
        continue;
      }

      const ageHours =
        (Date.now() - latest.fetchedAt.getTime()) / (1000 * 60 * 60);

      if (ageHours > 24) {
        count += 1;
      }
    }

    return count;
  }
}