import { Injectable } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { ItemTypeService } from '../market/item-type.service';
import { PriceVolatilityService } from '../market/price-volatility.service';
import { SourceConfidenceService } from '../market/source-confidence.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { LiquidityRankService } from '../strategy/liquidity-rank.service';
import { RiskManagementService } from '../strategy/risk-management.service';

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

  private resolveAction(score: number) {
    if (score >= 85) return 'buy_now';
    if (score >= 75) return 'queue';
    if (score >= 55) return 'watch';
    return 'skip';
  }

  async scan(options: { limit?: number; autoQueue?: boolean; minScore?: number }) {
    const limit = options.limit ?? 50;
    const autoQueue = options.autoQueue ?? false;
    const minScore = options.minScore ?? 75;

    const watchlist = await this.prisma.watchlistItem.findMany({
      where: { active: true },
      include: { item: true },
      take: limit * 2,
      orderBy: { priority: 'desc' },
    });

    if (watchlist.length === 0) return { count: 0, queued: 0, opportunities: [] };

    const opportunities = [];
    let queued = 0;
    const dbOperations = [];

    for (const watch of watchlist) {
      const listings = await this.prisma.marketListing.findMany({
        where: { itemId: watch.itemId, status: 'active' },
        include: { source: true },
        orderBy: { price: 'asc' },
        take: 20,
      });

      const snapshot = await this.prisma.marketSnapshot.findFirst({
        where: { itemId: watch.itemId },
        orderBy: { computedAt: 'desc' },
      });

      const prices = listings.map((l) => Number(l.price));
      const volatility = this.volatilityService.calculate(prices);
      const itemType = this.itemTypeService.detect(watch.titleSnapshot);

      for (const listing of listings) {
        const buyPrice = toMoney(Number(listing.price) + Number(listing.shippingPrice ?? 0));
        const targetSellPrice = toMoney(Number(watch.targetSellPrice ?? 0));

        if (targetSellPrice <= 0 || buyPrice <= 0) continue;

        const profit = calculateProfit({ revenue: targetSellPrice, cost: buyPrice });
        const roiPercent = calculateRoiPercent({ profit, cost: buyPrice });
        const sourceWeight = this.sourceConfidenceService.getWeight(listing.source?.code);

        const liquidity = this.liquidityRankService.rank({
          soldCount: snapshot?.listingsCount ?? listings.length,
          volatility,
          confidence: Number(snapshot?.confidenceScore ?? 0),
        });

        const flipStrategy = this.flipStrategyService.decide({
          itemType,
          buyPrice,
          targetSellPrice,
          medianPrice: Number(snapshot?.medianPrice ?? targetSellPrice),
          soldCount: snapshot?.listingsCount ?? listings.length,
          volatility,
          confidenceScore: Number(snapshot?.confidenceScore ?? 0),
        });

        const risk = this.riskManagementService.evaluate({
          buyPrice,
          expectedNetProfit: profit,
          roiPercent,
          liquidityScore: liquidity.score / 100,
          volatility,
          confidenceScore: Number(snapshot?.confidenceScore ?? 0),
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

        if (score < minScore) continue;

        opportunities.push({
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
          reason: action === 'buy_now' ? 'High-score opportunity' : action === 'queue' ? 'Good candidate' : 'Watch',
        });

        if (autoQueue && (action === 'buy_now' || action === 'queue')) {
          dbOperations.push(
            this.prisma.purchaseFlowItem.upsert({
              where: { id: `auto_${watch.id}_${listing.id}` },
              update: {},
              create: {
                id: `auto_${watch.id}_${listing.id}`,
                watchlistItemId: watch.id,
                selectedPrice: buyPrice,
                status: 'queued',
                reason: `Auto-queued from ${listing.source?.code ?? 'market'}`,
              },
            })
          );
          queued += 1;
        }
      }
    }

    if (dbOperations.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < dbOperations.length; i += chunkSize) {
        await this.prisma.$transaction(dbOperations.slice(i, i + chunkSize));
      }
    }

    opportunities.sort((a, b) => b.score - a.score);
    const finalOps = opportunities.slice(0, limit);

    this.realtime.emitOpportunityRefresh('engine_scan');
    this.realtime.emitDashboardRefresh('opportunity_engine_scan');
    if (queued > 0) this.realtime.emitFlowRefresh('purchase');

    return { count: finalOps.length, queued, opportunities: finalOps };
  }
}