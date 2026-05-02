import { Injectable } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';
import { ItemTypeService } from '../market/item-type.service';
import { PriceVolatilityService } from '../market/price-volatility.service';
import { SourceConfidenceService } from '../market/source-confidence.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { LiquidityRankService } from '../strategy/liquidity-rank.service';
import { RiskManagementService } from '../strategy/risk-management.service';

type EngineScanOptions = {
  limit: number;
  autoQueue: boolean;
  minScore: number;
};

type EngineOpportunity = {
  watchlistItemId: string;
  listingId: string;
  itemId: string;
  title: string;
  sourceCode: string;
  buyPrice: number;
  targetSellPrice: number;
  profit: number;
  roiPercent: number;
  score: number;
  action: 'buy_now' | 'queue' | 'watch' | 'skip';
  reason: string;
};

@Injectable()
export class OpportunityEngineService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly itemTypeService: ItemTypeService,
    private readonly volatilityService: PriceVolatilityService,
    private readonly sourceConfidenceService: SourceConfidenceService,
    private readonly flipStrategyService: FlipStrategyService,
    private readonly liquidityRankService: LiquidityRankService,
    private readonly riskManagementService: RiskManagementService,
  ) {}

  private resolveAction(score: number): EngineOpportunity['action'] {
    if (score >= 85) return 'buy_now';
    if (score >= 75) return 'queue';
    if (score >= 55) return 'watch';
    return 'skip';
  }

  async scan(options: Partial<EngineScanOptions>): Promise<{
    count: number;
    queued: number;
    opportunities: EngineOpportunity[];
  }> {
    const limit = options.limit ?? 50;
    const autoQueue = options.autoQueue ?? false;
    const minScore = options.minScore ?? 75;

    const watchlist = await this.prisma.watchlistItem.findMany({
      where: {
        active: true,
      },
      include: {
        item: true,
      },
      take: limit,
      orderBy: {
        priority: 'desc',
      },
    });

    const opportunities: EngineOpportunity[] = [];
    let queued = 0;

    for (const watch of watchlist) {
      const listings = await this.prisma.marketListing.findMany({
        where: {
          itemId: watch.itemId,
          status: 'active',
        },
        include: {
          source: true,
        },
        orderBy: {
          price: 'asc',
        },
        take: 10,
      });

      const snapshot = await this.prisma.marketSnapshot.findFirst({
        where: {
          itemId: watch.itemId,
        },
        orderBy: {
          computedAt: 'desc',
        },
      });

      const prices = listings.map((listing) => listing.price);
      const volatility = this.volatilityService.calculate(prices);
      const itemType = this.itemTypeService.detect(watch.titleSnapshot);

      for (const listing of listings) {
        const buyPrice = toMoney(listing.price + (listing.shippingPrice ?? 0));
        const targetSellPrice = toMoney(watch.targetSellPrice ?? 0);

        if (targetSellPrice <= 0 || buyPrice <= 0) {
          continue;
        }

        const profit = calculateProfit({
          revenue: targetSellPrice,
          cost: buyPrice,
        });

        const roiPercent = calculateRoiPercent({
          profit,
          cost: buyPrice,
        });

        const sourceWeight = this.sourceConfidenceService.getWeight(
          listing.source?.code,
        );

        const liquidity = this.liquidityRankService.rank({
          soldCount: snapshot?.listingsCount ?? listings.length,
          volatility,
          confidence: snapshot?.confidenceScore ?? 0,
        });

        const flipStrategy = this.flipStrategyService.decide({
          itemType,
          buyPrice,
          targetSellPrice,
          medianPrice: snapshot?.medianPrice ?? targetSellPrice,
          soldCount: snapshot?.listingsCount ?? listings.length,
          volatility,
          confidenceScore: snapshot?.confidenceScore ?? 0,
        });

        const risk = this.riskManagementService.evaluate({
          buyPrice,
          expectedNetProfit: profit,
          roiPercent,
          liquidityScore: liquidity.score / 100,
          volatility,
          confidenceScore: snapshot?.confidenceScore ?? 0,
        });

        const rawScore =
          roiPercent * 0.35 +
          profit * 0.08 +
          sourceWeight * 12 +
          liquidity.score * 0.2 +
          (100 - risk.riskScore) * 0.15 +
          flipStrategy.score * 0.1;

        const score = Number(Math.max(0, Math.min(100, rawScore)).toFixed(2));
        const action = this.resolveAction(score);

        const opportunity: EngineOpportunity = {
          watchlistItemId: watch.id,
          listingId: listing.id,
          itemId: watch.itemId,
          title: watch.titleSnapshot,
          sourceCode: listing.source?.code ?? 'unknown',
          buyPrice,
          targetSellPrice,
          profit,
          roiPercent,
          score,
          action,
          reason:
            action === 'buy_now'
              ? 'High-score opportunity with strong ROI/profit profile'
              : action === 'queue'
                ? 'Good candidate for purchase flow'
                : action === 'watch'
                  ? 'Worth monitoring'
                  : 'Weak opportunity',
        };

        opportunities.push(opportunity);

        if (autoQueue && score >= minScore) {
          const existing = await this.prisma.purchaseFlowItem.findFirst({
            where: {
              watchlistItemId: watch.id,
              status: {
                in: ['queued', 'pending'],
              },
            },
          });

          if (!existing) {
            await this.prisma.purchaseFlowItem.create({
              data: {
                watchlistItemId: watch.id,
                selectedPrice: buyPrice,
                status: 'queued',
                reason: `Queued from ${listing.source?.code ?? 'market'}`,
              },
            });

            queued += 1;
          }
        }
      }
    }

    opportunities.sort((a, b) => b.score - a.score);

    this.realtime.emitOpportunityRefresh('engine_scan');
    this.realtime.emitDashboardRefresh('opportunity_engine_scan');

    if (queued > 0) {
      this.realtime.emitFlowRefresh('purchase');
    }

    return {
      count: opportunities.length,
      queued,
      opportunities: opportunities.slice(0, limit),
    };
  }
}