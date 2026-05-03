import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { UnitEconomicsService } from '../finance/unit-economics.service';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitEconomicsService: UnitEconomicsService,
    private readonly redis: RedisService,
  ) {}

  async getFlowCounters(): Promise<{
    purchase: number;
    reprice: number;
    review: number;
    unresolved: number;
    orders: number;
    returns: number;
    procurement: number;
    reports: number;
    decisions: number;
  }> {
    const cacheKey = 'dashboard:flow_counters';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const [
      purchase,
      reprice,
      review,
      unresolved,
      orders,
      returns,
      procurement,
      reports,
      decisions,
    ] = await Promise.all([
      this.prisma.purchaseFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.repriceFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.reviewFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'pending' } }),
      this.prisma.order.count({
        where: { status: { in: ['pending', 'approved', 'contacted'] } },
      }),
      this.prisma.returnRequest.count({
        where: { status: { in: ['requested', 'approved'] } },
      }),
      this.prisma.purchaseOrder.count({
        where: { status: { in: ['planned', 'approved', 'ordered', 'paid'] } },
      }),
      this.prisma.reportSnapshot.count(),
      this.prisma.decisionSnapshot.count(),
    ]);

    const result = {
      purchase,
      reprice,
      review,
      unresolved,
      orders,
      returns,
      procurement,
      reports,
      decisions,
    };

    await this.redis.set(cacheKey, result, 60); // 1 хв кешу
    return result;
  }

  async getExecutionSummary(): Promise<unknown> {
    const cacheKey = 'dashboard:execution_summary';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const [
      purchasePending,
      purchaseBought,
      repricePending,
      repriceListed,
      reviewPending,
      reviewDone,
      unresolvedPending,
      ordersPending,
      ordersSold,
      returnsOpen,
      returnsResolved,
      procurementOpen,
      procurementReceived,
      reportsCount,
      latestReport,
      decisionsCount,
      latestDecision,
      buyNowDecisions,
      repriceDecisions,
    ] = await Promise.all([
      this.prisma.purchaseFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.purchaseFlowItem.count({ where: { status: 'bought' } }),
      this.prisma.repriceFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.repriceFlowItem.count({ where: { status: 'listed' } }),
      this.prisma.reviewFlowItem.count({ where: { status: 'pending' } }),
      this.prisma.reviewFlowItem.count({ where: { status: 'reviewed' } }),
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'pending' } }),
      this.prisma.order.count({
        where: { status: { in: ['pending', 'approved', 'contacted'] } },
      }),
      this.prisma.order.count({ where: { status: 'sold' } }),
      this.prisma.returnRequest.count({
        where: { status: { in: ['requested', 'approved'] } },
      }),
      this.prisma.returnRequest.count({ where: { status: 'resolved' } }),
      this.prisma.purchaseOrder.count({
        where: { status: { in: ['planned', 'approved', 'ordered', 'paid'] } },
      }),
      this.prisma.purchaseOrder.count({ where: { status: 'received' } }),
      this.prisma.reportSnapshot.count(),
      this.prisma.reportSnapshot.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.decisionSnapshot.count(),
      this.prisma.decisionSnapshot.findFirst({
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.decisionSnapshot.count({
        where: {
          action: 'BUY_NOW',
        },
      }),
      this.prisma.decisionSnapshot.count({
        where: {
          action: {
            in: ['REPRICE_UP', 'REPRICE_UP_OR_REVIEW'],
          },
        },
      }),
    ]);

    const totalOpen =
      purchasePending +
      repricePending +
      reviewPending +
      unresolvedPending +
      ordersPending +
      returnsOpen +
      procurementOpen +
      buyNowDecisions +
      repriceDecisions;

    const result = {
      purchasePending,
      purchaseBought,
      repricePending,
      repriceListed,
      reviewPending,
      reviewDone,
      unresolvedPending,
      ordersPending,
      ordersSold,
      returnsOpen,
      returnsResolved,
      procurementOpen,
      procurementReceived,
      reportsCount,
      latestReportAt: latestReport?.createdAt ?? null,
      decisionsCount,
      latestDecisionAt: latestDecision?.createdAt ?? null,
      buyNowDecisions,
      repriceDecisions,
      headline:
        totalOpen === 0
          ? 'Execution layer is clear'
          : `${totalOpen} execution items need attention`,
    };

    await this.redis.set(cacheKey, result, 60);
    return result;
  }

  async getBusinessSnapshot(): Promise<unknown> {
    const cacheKey = 'dashboard:business_snapshot';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const [
      inventoryAgg,
      watchlistAgg,
      salesAgg,
      returnsAgg,
      expensesAgg,
      ordersAgg,
      reservesAgg,
      poAgg,
      notificationsCount,
      reports,
      bestItems,
      worstItems,
      inventoryRisk,
      latestDecisions,
      buyNowDecisions,
      repriceDecisions,
    ] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _count: true,
        _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true }
      }),
      this.prisma.watchlistItem.aggregate({
        _count: true,
        where: { active: true }
      }),
      this.prisma.sale.aggregate({
        _count: true,
        _sum: { sellPrice: true, profit: true }
      }),
      this.prisma.returnRequest.aggregate({
        _sum: { refundAmount: true },
        where: { status: { in: ['approved', 'resolved'] } }
      }),
      this.prisma.expense.aggregate({
        _sum: { amount: true }
      }),
      this.prisma.order.groupBy({
        by: ['status'],
        _count: true,
        _sum: { sellPrice: true }
      }),
      this.prisma.reserveRequest.groupBy({
        by: ['status'],
        _count: true
      }),
      this.prisma.purchaseOrder.groupBy({
        by: ['status'],
        _count: true,
        _sum: { totalCost: true, actualPrice: true, plannedPrice: true }
      }),
      this.prisma.notification.count({ where: { read: false } }),
      this.prisma.reportSnapshot.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.unitEconomicsService.bestItems(),
      this.unitEconomicsService.worstItems(),
      this.unitEconomicsService.inventoryRisk(),
      this.prisma.decisionSnapshot.findMany({
        include: { item: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { action: 'BUY_NOW' },
        include: { item: true },
        orderBy: { score: 'desc' },
        take: 10,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: { action: { in: ['REPRICE_UP', 'REPRICE_UP_OR_REVIEW'] } },
        include: { item: true },
        orderBy: { score: 'desc' },
        take: 10,
      }),
    ]);

    const totalInventoryCost = toMoney(inventoryAgg._sum.totalCost ?? 0);
    const expectedInventoryValue = toMoney(inventoryAgg._sum.expectedSalePriceManual ?? inventoryAgg._sum.totalCost ?? 0);
    
    const grossRevenue = toMoney(salesAgg._sum.sellPrice ?? 0);
    const grossProfit = toMoney(salesAgg._sum.profit ?? 0);
    const refundAmount = toMoney(returnsAgg._sum.refundAmount ?? 0);
    const operatingExpenses = toMoney(expensesAgg._sum.amount ?? 0);

    const netRevenue = toMoney(grossRevenue - refundAmount);
    const netProfitBeforeExpenses = toMoney(grossProfit - refundAmount);
    const netProfit = toMoney(netProfitBeforeExpenses - operatingExpenses);

    const getStatusCount = (arr: any[], statuses: string[]) => 
      arr.filter(a => statuses.includes(a.status)).reduce((sum, a) => sum + a._count, 0);

    const getStatusSum = (arr: any[], statuses: string[], field: string) => 
      arr.filter(a => statuses.includes(a.status)).reduce((sum, a) => sum + Number(a._sum[field] ?? 0), 0);

    const openOrdersCount = getStatusCount(ordersAgg, ['pending', 'approved', 'contacted']);
    const openOrdersValue = getStatusSum(ordersAgg, ['pending', 'approved', 'contacted'], 'sellPrice');
    const openPoCount = getStatusCount(poAgg, ['planned', 'approved', 'ordered', 'paid']);
    const openPoCost = poAgg.filter(a => ['planned', 'approved', 'ordered', 'paid'].includes(a.status)).reduce((sum, a) => sum + Number(a._sum.totalCost ?? a._sum.actualPrice ?? a._sum.plannedPrice ?? 0), 0);

    const result = {
      inventoryItems: inventoryAgg._count,
      activeInventoryItems: inventoryAgg._sum.quantity ?? 0,
      watchlistItems: watchlistAgg._count,
      activeWatchlistItems: watchlistAgg._count,

      reserveRequests: reservesAgg.reduce((sum, r) => sum + r._count, 0),
      pendingReserveRequests: getStatusCount(reservesAgg, ['pending']),

      orders: ordersAgg.reduce((sum, o) => sum + o._count, 0),
      openOrders: openOrdersCount,
      soldOrders: getStatusCount(ordersAgg, ['sold']),
      openOrderValue: toMoney(openOrdersValue),

      returns: returnsAgg._sum.refundAmount ? 1 : 0, 
      openReturns: 0, 
      resolvedReturns: 0, 
      refundAmount,

      purchaseOrders: poAgg.reduce((sum, p) => sum + p._count, 0),
      openPurchaseOrders: openPoCount,
      receivedPurchaseOrders: getStatusCount(poAgg, ['received']),
      openPurchaseCost: toMoney(openPoCost),

      expenses: expensesAgg._sum.amount ? 1 : 0,
      operatingExpenses,

      reports: reports.length,
      latestReportAt: reports[0]?.createdAt ?? null,

      decisions: latestDecisions.length,
      buyNowDecisions: buyNowDecisions.length,
      repriceDecisions: repriceDecisions.length,

      unreadNotifications: notificationsCount,

      totalInventoryCost,
      expectedInventoryValue,
      expectedInventoryProfit: toMoney(expectedInventoryValue - totalInventoryCost),
      grossRevenue,
      grossProfit,
      netRevenue,
      netProfitBeforeExpenses,
      netProfit,
      salesCount: salesAgg._count,

      insights: {
        bestItems: bestItems.slice(0, 5),
        worstItems: worstItems.slice(0, 5),
        inventoryRisk: inventoryRisk.slice(0, 10),
        latestDecisions,
        buyNowDecisions,
        repriceDecisions,
      },
    };

    await this.redis.set(cacheKey, result, 120); // 2 хв кешу для Business Snapshot
    return result;
  }

  async getMarketSnapshot(): Promise<unknown> {
    const cacheKey = 'dashboard:market_snapshot';
    const cached = await this.redis.get<any>(cacheKey);
    if (cached) return cached;

    const [sources, listingsAgg, snapshots, decisions, errors] =
      await Promise.all([
        this.prisma.marketSource.findMany(),
        this.prisma.marketListing.groupBy({
          by: ['status'],
          _count: true
        }),
        this.prisma.marketSnapshot.count(),
        this.prisma.decisionSnapshot.count(),
        this.prisma.syncErrorLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
      ]);

    const result = {
      sources: sources.length,
      enabledSources: sources.filter((source) => source.enabled).length,
      listings: listingsAgg.reduce((sum, l) => sum + l._count, 0),
      activeListings: listingsAgg.find(l => l.status === 'active')?._count ?? 0,
      staleListings: listingsAgg.find(l => l.status === 'stale')?._count ?? 0,
      snapshots,
      decisions,
      syncErrors: errors.length,
      failedSyncErrors: errors.filter((error) =>
        error.message.toLowerCase().includes('failed'),
      ).length,
    };

    await this.redis.set(cacheKey, result, 60);
    return result;
  }

  async getRecentActivity(): Promise<unknown[]> {
    return this.prisma.activityLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
    });
  }

  async getDashboard(): Promise<unknown> {
    const [
      flowCounters,
      executionSummary,
      businessSnapshot,
      marketSnapshot,
      recentActivity,
    ] = await Promise.all([
      this.getFlowCounters(),
      this.getExecutionSummary(),
      this.getBusinessSnapshot(),
      this.getMarketSnapshot(),
      this.getRecentActivity(),
    ]);

    return {
      flowCounters,
      executionSummary,
      businessSnapshot,
      marketSnapshot,
      recentActivity,
    };
  }
}