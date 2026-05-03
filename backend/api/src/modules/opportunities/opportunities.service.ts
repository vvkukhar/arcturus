import { Injectable } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { SmartPricingService } from '../strategy/smart-pricing.service';
import { BundleDetectionService } from '../strategy/bundle-detection.service';
import { MinifigureArbitrageService } from '../strategy/minifigure-arbitrage.service';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly flipStrategy: FlipStrategyService,
    private readonly smartPricing: SmartPricingService,
    private readonly bundleDetection: BundleDetectionService,
    private readonly minifigureArbitrage: MinifigureArbitrageService,
  ) {}

  private resolveItemType(kind?: string | null): string {
    if (kind === 'minifigure') return 'minifigure';
    if (kind === 'bundle') return 'bundle';
    return 'set';
  }

  async getBuyOpportunities(params?: { limit?: number; minScore?: number }): Promise<unknown[]> {
    const watchlist = await this.prisma.watchlistItem.findMany({
      where: { active: true },
      include: { item: true, assignedUser: true },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      take: 300,
    });

    if (watchlist.length === 0) return [];

    const itemIds = watchlist.map((w) => w.itemId);
    const setNumbers = watchlist.map((w) => w.item?.setNumber).filter(Boolean) as string[];

    const [snapshots, decisions, listings, soldComps] = await Promise.all([
      this.prisma.marketSnapshot.findMany({
        where: { itemId: { in: itemIds } },
        orderBy: { computedAt: 'desc' },
        distinct: ['itemId'],
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { contextType: 'watchlist', contextId: { in: watchlist.map(w => w.id) } },
        orderBy: { createdAt: 'desc' },
        distinct: ['contextId'],
      }),
      this.prisma.marketListing.findMany({
        where: { itemId: { in: itemIds }, status: 'active' },
        orderBy: { price: 'asc' },
        include: { source: true },
      }),
      this.prisma.soldComp.findMany({
        where: { OR: [{ extractedSetNo: { in: setNumbers } }, { itemId: { in: itemIds } }] },
        orderBy: { soldAt: 'desc' },
      }),
    ]);

    const snapshotsMap = new Map(snapshots.map((s) => [s.itemId, s]));
    const decisionsMap = new Map(decisions.map((d) => [d.contextId, d]));
    const listingsMap = new Map<string, any[]>();
    const soldCompsMap = new Map<string, any[]>();

    for (const listing of listings) {
      const arr = listingsMap.get(listing.itemId) || [];
      if (arr.length < 10) arr.push(listing);
      listingsMap.set(listing.itemId, arr);
    }

    for (const comp of soldComps) {
      const key = comp.extractedSetNo || comp.itemId;
      if (!key) continue;
      const arr = soldCompsMap.get(key) || [];
      if (arr.length < 30) arr.push(comp);
      soldCompsMap.set(key, arr);
    }

    const rows: unknown[] = [];

    for (const entry of watchlist) {
      const snapshot = snapshotsMap.get(entry.itemId);
      const latestDecision = decisionsMap.get(entry.id);
      const entryListings = listingsMap.get(entry.itemId) || [];
      const entrySoldComps = soldCompsMap.get(entry.item?.setNumber || entry.itemId) || [];

      const bestListing = entryListings[0] ?? null;
      const totalBuy = toMoney(
        snapshot?.lowestPriceWithShipping ??
          (bestListing
            ? Number(bestListing.price) + Number(bestListing.shippingPrice ?? 0)
            : entry.maxBuyPrice),
      );

      const targetSellPrice = toMoney(
        entry.targetSellPrice ??
          snapshot?.medianPrice ??
          Math.max(entry.maxBuyPrice * 1.35, entry.desiredBuyPrice * 1.45),
      );

      const profit = calculateProfit({ revenue: targetSellPrice, cost: totalBuy });
      const roi = calculateRoiPercent({ profit, cost: totalBuy });

      const itemType = this.resolveItemType(entry.item?.kind);
      const volatility = Number(((latestDecision?.payloadJson as any)?.volatility ?? 0.25));

      const strategy = this.flipStrategy.decide({
        itemType,
        buyPrice: totalBuy,
        targetSellPrice,
        medianPrice: Number(snapshot?.medianPrice ?? targetSellPrice),
        soldCount: entrySoldComps.length,
        volatility,
        confidenceScore: Number(snapshot?.confidenceScore ?? 0.4),
      });

      const bundle = this.bundleDetection.detect({ title: entry.titleSnapshot, price: totalBuy });
      const arbitrage = itemType === 'minifigure'
          ? this.minifigureArbitrage.evaluate({
              buyPrice: totalBuy,
              targetSellPrice,
              soldCount: entrySoldComps.length,
              volatility,
              confidenceScore: Number(snapshot?.confidenceScore ?? 0.4),
            })
          : null;

      let action = latestDecision?.action ?? 'wait';
      let score = Number(latestDecision?.score ?? 45);
      let reasonPrimary = latestDecision?.reasonPrimary ?? 'Waiting for better market entry';
      let reasonSecondary = latestDecision?.reasonSecondary ?? 'No strong buy signal yet';

      if (roi >= 35 && profit >= 250 && totalBuy <= entry.maxBuyPrice) {
        action = 'BUY_NOW';
        score = Math.max(score, 90);
        reasonPrimary = 'Strong buy spread detected';
        reasonSecondary = 'ROI, profit and max-buy threshold are aligned';
      } else if (roi >= 20 && totalBuy <= entry.maxBuyPrice) {
        action = 'BUY';
        score = Math.max(score, 75);
        reasonPrimary = 'Acceptable buy opportunity';
        reasonSecondary = 'Entry price is inside max-buy zone';
      } else if (totalBuy <= entry.maxBuyPrice) {
        action = 'WATCH';
        score = Math.max(score, 62);
        reasonPrimary = 'Price is acceptable but upside is limited';
        reasonSecondary = 'Wait for stronger spread or better liquidity';
      }

      rows.push({
        watchlistItemId: entry.id,
        itemId: entry.itemId,
        title: entry.titleSnapshot,
        setNumber: entry.item?.setNumber ?? null,
        theme: entry.item?.theme ?? null,
        assignedUser: entry.assignedUser,
        score,
        action,
        actionReasonPrimary: reasonPrimary,
        actionReasonSecondary: reasonSecondary,
        profit,
        roi,
        marginPercent: roi,
        totalBuy,
        targetSellPrice,
        sourceCode: bestListing?.sourceCode ?? bestListing?.source?.code ?? null,
        listingId: bestListing?.id ?? null,
        listingUrl: bestListing?.url ?? null,
        flipStrategy: strategy.strategy,
        flipStrategyScore: strategy.score,
        flipStrategyReasonPrimary: strategy.reasonPrimary,
        flipStrategyReasonSecondary: strategy.reasonSecondary,
        bundleDetected: bundle.isBundle,
        bundleConfidence: bundle.confidence,
        arbitrageScore: arbitrage?.score ?? null,
        market: {
          listingsCount: snapshot?.listingsCount ?? entryListings.length,
          medianPrice: snapshot?.medianPrice ?? null,
          lowestPriceWithShipping: snapshot?.lowestPriceWithShipping ?? null,
          confidenceScore: snapshot?.confidenceScore ?? null,
        },
      });
    }

    return rows
      .filter((row: any) => row.score >= (params?.minScore ?? 0))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, params?.limit ?? 50);
  }

  async getSellOpportunities(params?: { limit?: number; minScore?: number }): Promise<unknown[]> {
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      include: { item: true, assignedUser: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });

    if (inventory.length === 0) return [];

    const itemIds = inventory.map((i) => i.itemId);
    const setNumbers = inventory.map((i) => i.item?.setNumber).filter(Boolean) as string[];

    const [snapshots, decisions, listings, soldComps] = await Promise.all([
      this.prisma.marketSnapshot.findMany({
        where: { itemId: { in: itemIds } },
        orderBy: { computedAt: 'desc' },
        distinct: ['itemId'],
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { contextType: 'inventory', contextId: { in: inventory.map(i => i.id) } },
        orderBy: { createdAt: 'desc' },
        distinct: ['contextId'],
      }),
      this.prisma.marketListing.findMany({
        where: { itemId: { in: itemIds }, status: 'active' },
        orderBy: { price: 'asc' },
        include: { source: true },
      }),
      this.prisma.soldComp.findMany({
        where: { OR: [{ extractedSetNo: { in: setNumbers } }, { itemId: { in: itemIds } }] },
        orderBy: { soldAt: 'desc' },
      }),
    ]);

    const snapshotsMap = new Map(snapshots.map((s) => [s.itemId, s]));
    const decisionsMap = new Map(decisions.map((d) => [d.contextId, d]));
    const listingsMap = new Map<string, any[]>();
    const soldCompsMap = new Map<string, any[]>();

    for (const listing of listings) {
      const arr = listingsMap.get(listing.itemId) || [];
      if (arr.length < 30) arr.push(listing);
      listingsMap.set(listing.itemId, arr);
    }

    for (const comp of soldComps) {
      const key = comp.extractedSetNo || comp.itemId;
      if (!key) continue;
      const arr = soldCompsMap.get(key) || [];
      if (arr.length < 30) arr.push(comp);
      soldCompsMap.set(key, arr);
    }

    const rows: unknown[] = [];

    for (const entry of inventory) {
      const snapshot = snapshotsMap.get(entry.itemId);
      const latestDecision = decisionsMap.get(entry.id);
      const entryListings = listingsMap.get(entry.itemId) || [];
      const entrySoldComps = soldCompsMap.get(entry.item?.setNumber || entry.itemId) || [];

      const totalCostBasis = toMoney(entry.totalCost);
      const itemType = this.resolveItemType(entry.item?.kind);
      const volatility = Number(((latestDecision?.payloadJson as any)?.volatility ?? 0.25));

      const strategy = this.flipStrategy.decide({
        itemType,
        buyPrice: totalCostBasis,
        targetSellPrice: Number(entry.expectedSalePriceManual ?? snapshot?.medianPrice ?? totalCostBasis),
        medianPrice: Number(snapshot?.medianPrice ?? totalCostBasis),
        soldCount: entrySoldComps.length,
        volatility,
        confidenceScore: Number(snapshot?.confidenceScore ?? 0.4),
      });

      const smartPrice = this.smartPricing.suggest({
        costBasis: totalCostBasis,
        lowestMarketPrice: Number(snapshot?.lowestPriceWithShipping ?? totalCostBasis),
        medianMarketPrice: Number(snapshot?.medianPrice ?? entry.expectedSalePriceManual ?? totalCostBasis),
        soldCount: entrySoldComps.length,
        volatility,
        strategy: strategy.strategy,
      });

      const targetSellPrice = toMoney(entry.expectedSalePriceManual ?? smartPrice.suggestedPrice);
      const profit = calculateProfit({ revenue: targetSellPrice, cost: totalCostBasis });
      const roi = calculateRoiPercent({ profit, cost: totalCostBasis });

      let action = latestDecision?.action ?? 'hold';
      let score = Number(latestDecision?.score ?? 50);
      let reasonPrimary = latestDecision?.reasonPrimary ?? 'Hold position';
      let reasonSecondary = latestDecision?.reasonSecondary ?? 'No urgent sell signal';

      if (roi >= 45 && profit >= 350) {
        action = 'SELL_NOW';
        score = Math.max(score, 88);
        reasonPrimary = 'Strong exit opportunity';
        reasonSecondary = 'Profit and ROI are both attractive';
      } else if (roi >= 25 && profit >= 150) {
        action = 'LIST';
        score = Math.max(score, 76);
        reasonPrimary = 'Listing is justified';
        reasonSecondary = 'Current market supports profitable exit';
      } else if (snapshot?.medianPrice && entry.expectedSalePriceManual && snapshot.medianPrice > entry.expectedSalePriceManual + 100) {
        action = 'REPRICE';
        score = Math.max(score, 80);
        reasonPrimary = 'Manual price is below market';
        reasonSecondary = 'Reprice can improve return';
      }

      rows.push({
        inventoryItemId: entry.id,
        itemId: entry.itemId,
        title: entry.titleSnapshot,
        setNumber: entry.item?.setNumber ?? null,
        theme: entry.item?.theme ?? null,
        assignedUser: entry.assignedUser,
        score,
        action,
        actionReasonPrimary: reasonPrimary,
        actionReasonSecondary: reasonSecondary,
        profit,
        roi,
        marginPercent: roi,
        totalCostBasis,
        targetSellPrice,
        suggestedSellPrice: smartPrice.suggestedPrice,
        floorSellPrice: smartPrice.floorPrice,
        stretchSellPrice: smartPrice.stretchPrice,
        flipStrategy: strategy.strategy,
        flipStrategyScore: strategy.score,
        flipStrategyReasonPrimary: strategy.reasonPrimary,
        flipStrategyReasonSecondary: strategy.reasonSecondary,
        primaryImage: entry.images.find((image) => image.isPrimary)?.imageUrl ?? entry.images[0]?.imageUrl ?? null,
        market: {
          listingsCount: snapshot?.listingsCount ?? entryListings.length,
          medianPrice: snapshot?.medianPrice ?? null,
          lowestPriceWithShipping: snapshot?.lowestPriceWithShipping ?? null,
          confidenceScore: snapshot?.confidenceScore ?? null,
        },
      });
    }

    return rows
      .filter((row: any) => row.score >= (params?.minScore ?? 0))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, params?.limit ?? 50);
  }

  async getBuyOpportunityDetail(itemId: string): Promise<unknown> {
    const opportunities = (await this.getBuyOpportunities({ limit: 300 })) as any[];
    const opportunity = opportunities.find((row) => row.itemId === itemId);

    const [item, listings, snapshots, decisions, soldComps] = await Promise.all([
      this.prisma.item.findUnique({ where: { id: itemId } }),
      this.prisma.marketListing.findMany({
        where: { itemId },
        include: { source: true },
        orderBy: { fetchedAt: 'desc' },
        take: 50,
      }),
      this.prisma.marketSnapshot.findMany({
        where: { itemId },
        orderBy: { computedAt: 'desc' },
        take: 20,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { itemId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.soldComp.findMany({
        where: { OR: [{ extractedSetNo: itemId }, { itemId }] },
        orderBy: { soldAt: 'desc' },
        take: 30,
      }),
    ]);

    return { opportunity: opportunity ?? null, item, listings, snapshots, decisions, soldComps };
  }

  async getSellOpportunityDetail(itemId: string): Promise<unknown> {
    const opportunities = (await this.getSellOpportunities({ limit: 300 })) as any[];
    const opportunity = opportunities.find((row) => row.itemId === itemId);

    const [item, inventory, listings, snapshots, decisions, soldComps] = await Promise.all([
      this.prisma.item.findUnique({ where: { id: itemId } }),
      this.prisma.inventoryItem.findMany({
        where: { itemId },
        include: { images: { orderBy: { sortOrder: 'asc' } }, assignedUser: true },
      }),
      this.prisma.marketListing.findMany({
        where: { itemId },
        include: { source: true },
        orderBy: { fetchedAt: 'desc' },
        take: 50,
      }),
      this.prisma.marketSnapshot.findMany({
        where: { itemId },
        orderBy: { computedAt: 'desc' },
        take: 20,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { itemId },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      this.prisma.soldComp.findMany({
        where: { OR: [{ extractedSetNo: itemId }, { itemId }] },
        orderBy: { soldAt: 'desc' },
        take: 30,
      }),
    ]);

    return { opportunity: opportunity ?? null, item, inventory, listings, snapshots, decisions, soldComps };
  }
}