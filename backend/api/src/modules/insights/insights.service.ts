import { Injectable, NotFoundException } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';
import { ItemTypeService } from '../market/item-type.service';
import { PriceVolatilityService } from '../market/price-volatility.service';
import { SoldCompsService } from '../market/sold-comps.service';
import { PrismaService } from '../prisma/prisma.service';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { LiquidityRankService } from '../strategy/liquidity-rank.service';
import { RiskManagementService } from '../strategy/risk-management.service';
import { SmartPricingService } from '../strategy/smart-pricing.service';

type InsightAction = 'buy' | 'sell' | 'hold' | 'review' | 'avoid';

@Injectable()
export class InsightsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly itemTypeService: ItemTypeService,
    private readonly soldCompsService: SoldCompsService,
    private readonly volatilityService: PriceVolatilityService,
    private readonly flipStrategyService: FlipStrategyService,
    private readonly smartPricingService: SmartPricingService,
    private readonly liquidityRankService: LiquidityRankService,
    private readonly riskManagementService: RiskManagementService,
  ) {}

  private resolveAction(params: {
    roiPercent: number;
    profit: number;
    confidenceScore: number;
    liquidityScore: number;
    context: 'inventory' | 'watchlist';
  }): InsightAction {
    if (params.context === 'watchlist') {
      if (
        params.roiPercent >= 30 &&
        params.profit >= 120 &&
        params.confidenceScore >= 0.45
      ) {
        return 'buy';
      }

      if (params.roiPercent < 10 || params.profit < 50) {
        return 'avoid';
      }

      return 'hold';
    }

    if (
      params.roiPercent >= 25 &&
      params.profit >= 150 &&
      params.confidenceScore >= 0.45
    ) {
      return 'sell';
    }

    if (params.roiPercent < 8 || params.profit < 50) {
      return 'review';
    }

    return 'hold';
  }

  async getInventoryInsight(inventoryItemId: string): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: {
        id: inventoryItemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: {
        itemId: inventory.itemId,
      },
      orderBy: {
        computedAt: 'desc',
      },
    });

    const latestDecision = await this.prisma.decisionSnapshot.findFirst({
      where: {
        contextType: 'inventory',
        contextId: inventory.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const listings = await this.prisma.marketListing.findMany({
      where: {
        itemId: inventory.itemId,
        status: 'active',
      },
      take: 30,
    });

    const sold = await this.soldCompsService.getSoldCompSummary(inventory.itemId);
    const volatility = this.volatilityService.calculate(
      listings.map((listing) => listing.price),
    );

    const itemType = this.itemTypeService.detect(inventory.titleSnapshot);

    const targetSellPrice = toMoney(
      inventory.expectedSalePriceManual ??
        snapshot?.medianPrice ??
        snapshot?.lowestPriceWithShipping ??
        inventory.totalCost,
    );

    const profit = calculateProfit({
      revenue: targetSellPrice,
      cost: inventory.totalCost,
    });

    const roiPercent = calculateRoiPercent({
      profit,
      cost: inventory.totalCost,
    });

    const liquidity = this.liquidityRankService.rank({
      soldCount: sold.soldCount,
      volatility,
      confidence: snapshot?.confidenceScore ?? 0,
    });

    const flipStrategy = this.flipStrategyService.decide({
      itemType,
      buyPrice: inventory.totalCost,
      targetSellPrice,
      medianPrice: snapshot?.medianPrice ?? targetSellPrice,
      soldCount: sold.soldCount,
      volatility,
      confidenceScore: snapshot?.confidenceScore ?? 0,
    });

    const smartPricing = this.smartPricingService.suggest({
      costBasis: inventory.totalCost,
      lowestMarketPrice: snapshot?.lowestPriceWithShipping ?? targetSellPrice,
      medianMarketPrice: snapshot?.medianPrice ?? targetSellPrice,
      soldCount: sold.soldCount,
      volatility,
      strategy: flipStrategy.strategy,
    });

    const risk = this.riskManagementService.evaluate({
      buyPrice: inventory.totalCost,
      expectedNetProfit: profit,
      roiPercent,
      liquidityScore: liquidity.score / 100,
      volatility,
      confidenceScore: snapshot?.confidenceScore ?? 0,
    });

    const action = this.resolveAction({
      roiPercent,
      profit,
      confidenceScore: snapshot?.confidenceScore ?? 0,
      liquidityScore: liquidity.score / 100,
      context: 'inventory',
    });

    return {
      context: 'inventory',
      inventoryItemId: inventory.id,
      itemId: inventory.itemId,
      title: inventory.titleSnapshot,
      setNumber: inventory.item?.setNumber ?? null,
      itemType,
      action,
      targetSellPrice,
      profit,
      roiPercent,
      quantity: inventory.quantity,
      totalCost: inventory.totalCost,
      confidenceScore: snapshot?.confidenceScore ?? 0,
      market: {
        snapshot,
        sold,
        volatility,
      },
      liquidity,
      risk,
      flipStrategy,
      smartPricing,
      latestDecision,
    };
  }

  async getWatchlistInsight(watchlistItemId: string): Promise<unknown> {
    const watchlist = await this.prisma.watchlistItem.findUnique({
      where: {
        id: watchlistItemId,
      },
      include: {
        item: true,
      },
    });

    if (!watchlist) {
      throw new NotFoundException('Watchlist item not found');
    }

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: {
        itemId: watchlist.itemId,
      },
      orderBy: {
        computedAt: 'desc',
      },
    });

    const bestListing = await this.prisma.marketListing.findFirst({
      where: {
        itemId: watchlist.itemId,
        status: 'active',
      },
      orderBy: {
        price: 'asc',
      },
      include: {
        source: true,
      },
    });

    const latestDecision = await this.prisma.decisionSnapshot.findFirst({
      where: {
        contextType: 'watchlist',
        contextId: watchlist.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const listings = await this.prisma.marketListing.findMany({
      where: {
        itemId: watchlist.itemId,
        status: 'active',
      },
      take: 30,
    });

    const sold = await this.soldCompsService.getSoldCompSummary(watchlist.itemId);
    const volatility = this.volatilityService.calculate(
      listings.map((listing) => listing.price),
    );

    const itemType = this.itemTypeService.detect(watchlist.titleSnapshot);

    const buyPrice = toMoney(
      bestListing?.price ??
        snapshot?.lowestPriceWithShipping ??
        watchlist.maxBuyPrice,
    );

    const targetSellPrice = toMoney(watchlist.targetSellPrice ?? 0);

    const profit = calculateProfit({
      revenue: targetSellPrice,
      cost: buyPrice,
    });

    const roiPercent = calculateRoiPercent({
      profit,
      cost: buyPrice,
    });

    const liquidity = this.liquidityRankService.rank({
      soldCount: sold.soldCount,
      volatility,
      confidence: snapshot?.confidenceScore ?? 0,
    });

    const flipStrategy = this.flipStrategyService.decide({
      itemType,
      buyPrice,
      targetSellPrice,
      medianPrice: snapshot?.medianPrice ?? targetSellPrice,
      soldCount: sold.soldCount,
      volatility,
      confidenceScore: snapshot?.confidenceScore ?? 0,
    });

    const smartPricing = this.smartPricingService.suggest({
      costBasis: buyPrice,
      lowestMarketPrice: snapshot?.lowestPriceWithShipping ?? buyPrice,
      medianMarketPrice: snapshot?.medianPrice ?? targetSellPrice,
      soldCount: sold.soldCount,
      volatility,
      strategy: flipStrategy.strategy,
    });

    const risk = this.riskManagementService.evaluate({
      buyPrice,
      expectedNetProfit: profit,
      roiPercent,
      liquidityScore: liquidity.score / 100,
      volatility,
      confidenceScore: snapshot?.confidenceScore ?? 0,
    });

    const action = this.resolveAction({
      roiPercent,
      profit,
      confidenceScore: snapshot?.confidenceScore ?? 0,
      liquidityScore: liquidity.score / 100,
      context: 'watchlist',
    });

    return {
      context: 'watchlist',
      watchlistItemId: watchlist.id,
      itemId: watchlist.itemId,
      title: watchlist.titleSnapshot,
      setNumber: watchlist.item?.setNumber ?? null,
      itemType,
      action,
      buyPrice,
      desiredBuyPrice: watchlist.desiredBuyPrice,
      maxBuyPrice: watchlist.maxBuyPrice,
      targetSellPrice,
      profit,
      roiPercent,
      confidenceScore: snapshot?.confidenceScore ?? 0,
      market: {
        snapshot,
        bestListing,
        sold,
        volatility,
      },
      liquidity,
      risk,
      flipStrategy,
      smartPricing,
      latestDecision,
    };
  }

  async getDashboardInsights(limit = 20): Promise<unknown> {
    const [inventory, watchlist] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
      }),
      this.prisma.watchlistItem.findMany({
        where: {
          active: true,
        },
        orderBy: {
          priority: 'desc',
        },
        take: limit,
      }),
    ]);

    const inventoryInsights = await Promise.all(
      inventory.map((item) => this.getInventoryInsight(item.id)),
    );

    const watchlistInsights = await Promise.all(
      watchlist.map((item) => this.getWatchlistInsight(item.id)),
    );

    return {
      inventory: inventoryInsights,
      watchlist: watchlistInsights,
      all: [...inventoryInsights, ...watchlistInsights],
    };
  }
}