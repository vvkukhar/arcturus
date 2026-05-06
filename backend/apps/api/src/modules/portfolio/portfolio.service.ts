import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CapitalAllocationService } from '../strategy/capital-allocation.service';
import { LiquidityRankService } from '../strategy/liquidity-rank.service';
import { PriceVolatilityService } from '../market/price-volatility.service';
import { FlipStrategyService } from '../strategy/flip-strategy.service';
import { toMoney } from '@arcturus/shared';

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
    const agg = await this.prisma.inventoryItem.aggregate({
      _count: true,
      _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true }
    });

    const totalCostBasis = toMoney(agg._sum.totalCost ?? 0);
    const expectedRevenue = toMoney(agg._sum.expectedSalePriceManual ?? agg._sum.totalCost ?? 0);
    const expectedProfit = toMoney(expectedRevenue - totalCostBasis);

    return {
      inventoryItems: agg._count,
      activeUnits: agg._sum.quantity ?? 0,
      totalCostBasis,
      expectedRevenue,
      expectedProfit,
      expectedRoi: totalCostBasis > 0 ? Number(((expectedProfit / totalCostBasis) * 100).toFixed(2)) : 0,
    };
  }

  async getSummary(): Promise<unknown> {
    const [inventoryValue, salesAgg, watchlistAgg, reservesAgg] = await Promise.all([
      this.getInventoryValue(),
      this.prisma.sale.aggregate({
        _count: true,
        _sum: { sellPrice: true, profit: true }
      }),
      this.prisma.watchlistItem.aggregate({
        where: { active: true },
        _count: true,
        _sum: { maxBuyPrice: true }
      }),
      this.prisma.reserveRequest.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    const getReserveCount = (status: string) => reservesAgg.find(r => r.status === status)?._count ?? 0;

    return {
      inventory: inventoryValue,
      sales: {
        count: salesAgg._count,
        totalRevenue: toMoney(salesAgg._sum.sellPrice ?? 0),
        realizedProfit: toMoney(salesAgg._sum.profit ?? 0)
      },
      watchlist: {
        active: watchlistAgg._count,
        totalDesiredCapital: toMoney(watchlistAgg._sum.maxBuyPrice ?? 0),
      },
      reserves: {
        total: reservesAgg.reduce((sum, r) => sum + r._count, 0),
        pending: getReserveCount('pending'),
        approved: getReserveCount('approved'),
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
        select: { itemId: true, lowestPriceWithShipping: true, listingsCount: true, confidenceScore: true, medianPrice: true }
      }),
      this.prisma.marketListing.findMany({
        where: { itemId: { in: itemIds }, status: 'active' },
        select: { itemId: true, price: true }
      }),
    ]);

    const snapshotsMap = new Map(snapshots.map((s) => [s.itemId, s]));
    const listingsMap = new Map<string, number[]>();

    for (const listing of listings) {
      const arr = listingsMap.get(listing.itemId) || [];
      arr.push(listing.price);
      listingsMap.set(listing.itemId, arr);
    }

    const candidates = [];

    for (const item of watchlist) {
      const snapshot = snapshotsMap.get(item.itemId);
      const prices = listingsMap.get(item.itemId) || [];
      const volatility = this.volatility.calculate(prices);

      const buyPrice = snapshot?.lowestPriceWithShipping ?? item.maxBuyPrice ?? item.desiredBuyPrice;
      const targetSellPrice = item.targetSellPrice ?? 0;
      const expectedNetProfit = toMoney(targetSellPrice - buyPrice);
      const roiPercent = buyPrice > 0 ? Number(((expectedNetProfit / buyPrice) * 100).toFixed(2)) : 0;

      const liquidity = this.liquidityRank.rank({
        soldCount: snapshot?.listingsCount ?? prices.length,
        volatility,
        confidence: snapshot?.confidenceScore ?? 0,
      });

      const strategy = this.flipStrategy.decide({
        itemType: item.item?.kind ?? 'set',
        buyPrice,
        targetSellPrice,
        medianPrice: snapshot?.medianPrice ?? targetSellPrice,
        soldCount: snapshot?.listingsCount ?? prices.length,
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