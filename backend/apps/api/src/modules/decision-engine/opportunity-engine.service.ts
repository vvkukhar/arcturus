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

type EngineScanOptions = { limit: number; autoQueue: boolean; minScore: number };

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

  private resolveAction(score: number): 'buy_now' | 'queue' | 'watch' | 'skip' {
    if (score >= 85) return 'buy_now';
    if (score >= 75) return 'queue';
    if (score >= 55) return 'watch';
    return 'skip';
  }

  async scan(options: Partial<EngineScanOptions>) {
    const limit = options.limit ?? 50;
    const autoQueue = options.autoQueue ?? false;
    const minScore = options.minScore ?? 75;

    const watchlist = await this.prisma.watchlistItem.findMany({
      where: { active: true },
      include: { item: true },
      orderBy: { priority: 'desc' },
    });

    if (watchlist.length === 0) return { count: 0, queued: 0, opportunities: [] };

    let queued = 0;
    const opportunities = [];
    const createPayloads = [];

    // ФІКС: Розбиваємо watchlist на чанки по 50 записів, щоб не забивати RAM
    const CHUNK_SIZE = 50;
    for (let i = 0; i < watchlist.length; i += CHUNK_SIZE) {
      const chunk = watchlist.slice(i, i + CHUNK_SIZE);
      const itemIds = chunk.map((w) => w.itemId);

      const [allListings, allSnapshots] = await Promise.all([
        this.prisma.marketListing.findMany({
          where: { itemId: { in: itemIds }, status: 'active' },
          include: { source: true },
          orderBy: { price: 'asc' },
        }),
        this.prisma.marketSnapshot.findMany({
          where: { itemId: { in: itemIds } },
          orderBy: { computedAt: 'desc' },
          distinct: ['itemId'],
        }),
      ]);

      const listingsMap = new Map<string, typeof allListings>();
      for (const listing of allListings) {
        const arr = listingsMap.get(listing.itemId) || [];
        if (arr.length < 10) arr.push(listing);
        listingsMap.set(listing.itemId, arr);
      }

      const snapshotsMap = new Map(allSnapshots.map((s) => [s.itemId, s]));

      for (const watch of chunk) {
        const listings = listingsMap.get(watch.itemId) || [];
        if (listings.length === 0) continue;

        const snapshot = snapshotsMap.get(watch.itemId);
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
            (100 - risk.riskScore) * 0.15;

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
          });

          if (autoQueue && (action === 'buy_now' || action === 'queue')) {
            createPayloads.push({
              id: `auto_${watch.id}_${listing.id}`,
              watchlistItemId: watch.id,
              selectedPrice: buyPrice,
              status: 'queued',
              reason: `Auto-queued from ${listing.source?.code ?? 'market'}`,
            });
          }
        }
      }

      // Зберігаємо чергу батчами, щоб не накопичувати величезні транзакції
      if (createPayloads.length > 0) {
        await this.prisma.purchaseFlowItem.createMany({
          data: createPayloads,
          skipDuplicates: true,
        });
        queued += createPayloads.length;
        createPayloads.length = 0; // очищуємо пам'ять
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