import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CapitalAllocationService } from '../strategy/capital-allocation.service';
import { LiquidityRankService } from '../strategy/liquidity-rank.service';
import { PriceVolatilityService } from '../market/price-volatility.service';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { toMoney } from '../../common/money.utils';

@Injectable()
export class PortfolioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly capitalAllocation: CapitalAllocationService,
    private readonly liquidityRank: LiquidityRankService,
    private readonly volatility: PriceVolatilityService,
    private readonly flipStrategy: FlipStrategyService,
  ) {}

  async getInventoryValue(): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findMany({ include: { item: true } });

    const totalCostBasis = toMoney(inventory.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0));
    const expectedRevenue = toMoney(
      inventory.reduce(
        (sum, item) => sum + Number(item.expectedSalePriceManual ?? item.totalCost ?? item.purchasePrice ?? 0) * item.quantity,
        0,
      ),
    );

    const expectedProfit = toMoney(expectedRevenue - totalCostBasis);
    const activeUnits = inventory.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0);

    return {
      inventoryItems: inventory.length,
      activeUnits,
      totalCostBasis,
      expectedRevenue,
      expectedProfit,
      expectedRoi: totalCostBasis > 0 ? Number(((expectedProfit / totalCostBasis) * 100).toFixed(2)) : 0,
    };
  }

  async getSummary(): Promise<unknown> {
    const [inventoryValue, sales, watchlist, reserves] = await Promise.all([
      this.getInventoryValue(),
      this.prisma.sale.findMany(),
      this.prisma.watchlistItem.findMany({ where: { active: true } }),
      this.prisma.reserveRequest.findMany(),
    ]);

    const totalRevenue = toMoney(sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0));
    const realizedProfit = toMoney(sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0));

    return {
      inventory: inventoryValue,
      sales: { count: sales.length, totalRevenue, realizedProfit },
      watchlist: {
        active: watchlist.length,
        totalDesiredCapital: toMoney(watchlist.reduce((sum, item) => sum + Number(item.maxBuyPrice ?? 0), 0)),
      },
      reserves: {
        total: reserves.length,
        pending: reserves.filter((x) => x.status === 'pending').length,
        approved: reserves.filter((x) => x.status === 'approved').length,
      },
    };
  }

  async getCapitalPlan(capital: number): Promise<unknown> {
    if (!Number.isFinite(capital) || capital <= 0) {
      return { capital, allocations: [], message: 'Capital must be greater than zero' };
    }

    const watchlist = await this.prisma.watchlistItem.findMany({
      where: { active: true },
      include: { item: true },
    });

    if (watchlist.length === 0) {
      return { capital, candidateCount: 0, allocations: [], reservedCapital: 0, remainingCapital: capital };
    }

    const itemIds = watchlist.map((w) => w.itemId);

    const [snapshots, listings] = await Promise.all([
      this.prisma.marketSnapshot.findMany({
        where: { itemId: { in: itemIds } },
        orderBy: { computedAt: 'desc' },
        distinct: ['itemId'],
      }),
      this.prisma.marketListing.findMany({
        where: { itemId: { in: itemIds }, status: 'active' },
      }),
    ]);

    const snapshotsMap = new Map(snapshots.map((s) => [s.itemId, s]));
    const listingsMap = new Map<string, any[]>();

    for (const listing of listings) {
      const arr = listingsMap.get(listing.itemId) || [];
      arr.push(listing);
      listingsMap.set(listing.itemId, arr);
    }

    const candidates = [];

    for (const item of watchlist) {
      const snapshot = snapshotsMap.get(item.itemId);
      const itemListings = listingsMap.get(item.itemId) || [];

      const prices = itemListings.map((listing) => listing.price);
      const volatility = this.volatility.calculate(prices);

      const buyPrice = snapshot?.lowestPriceWithShipping ?? item.maxBuyPrice ?? item.desiredBuyPrice;
      const targetSellPrice = item.targetSellPrice ?? 0;
      const expectedNetProfit = toMoney(targetSellPrice - buyPrice);
      const roiPercent = buyPrice > 0 ? Number(((expectedNetProfit / buyPrice) * 100).toFixed(2)) : 0;

      const liquidity = this.liquidityRank.rank({
        soldCount: snapshot?.listingsCount ?? itemListings.length,
        volatility,
        confidence: snapshot?.confidenceScore ?? 0,
      });

      const strategy = this.flipStrategy.decide({
        itemType: item.item?.kind ?? 'set',
        buyPrice,
        targetSellPrice,
        medianPrice: snapshot?.medianPrice ?? targetSellPrice,
        soldCount: snapshot?.listingsCount ?? itemListings.length,
        volatility,
        confidenceScore: snapshot?.confidenceScore ?? 0,
      });

      candidates.push({
        itemId: item.itemId,
        title: item.titleSnapshot,
        buyPrice,
        expectedNetProfit,
        roiPercent,
        liquidityScore: liquidity.score / 100,
        confidenceScore: snapshot?.confidenceScore ?? 0,
        strategy: strategy.strategy,
      });
    }

    const allocations = this.capitalAllocation.allocate(capital, candidates);
    const reservedCapital = allocations.reduce((sum, item) => sum + item.reservedCapital, 0);

    return {
      capital,
      candidateCount: candidates.length,
      allocations,
      reservedCapital: toMoney(reservedCapital),
      remainingCapital: toMoney(capital - reservedCapital),
    };
  }
}