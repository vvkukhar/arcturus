import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { UnitEconomicsService } from '../finance/unit-economics.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly unitEconomicsService: UnitEconomicsService,
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

    return {
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
  }

  async getExecutionSummary(): Promise<unknown> {
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

    return {
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
  }

  async getBusinessSnapshot(): Promise<unknown> {
    const [
      inventory,
      watchlist,
      sales,
      returns,
      expenses,
      reserves,
      orders,
      purchaseOrders,
      notifications,
      reports,
      bestItems,
      worstItems,
      inventoryRisk,
      latestDecisions,
      buyNowDecisions,
      repriceDecisions,
    ] = await Promise.all([
      this.prisma.inventoryItem.findMany(),
      this.prisma.watchlistItem.findMany(),
      this.prisma.sale.findMany(),
      this.prisma.returnRequest.findMany(),
      this.prisma.expense.findMany(),
      this.prisma.reserveRequest.findMany(),
      this.prisma.order.findMany(),
      this.prisma.purchaseOrder.findMany(),
      this.prisma.notification.findMany({ where: { read: false } }),
      this.prisma.reportSnapshot.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
      this.unitEconomicsService.bestItems(),
      this.unitEconomicsService.worstItems(),
      this.unitEconomicsService.inventoryRisk(),
      this.prisma.decisionSnapshot.findMany({
        include: {
          item: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: {
          action: 'BUY_NOW',
        },
        include: {
          item: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 10,
      }),
      this.prisma.decisionSnapshot.findMany({
        where: {
          action: {
            in: ['REPRICE_UP', 'REPRICE_UP_OR_REVIEW'],
          },
        },
        include: {
          item: true,
        },
        orderBy: {
          score: 'desc',
        },
        take: 10,
      }),
    ]);

    const totalInventoryCost = toMoney(
      inventory.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0),
    );

    const expectedInventoryValue = toMoney(
      inventory.reduce(
        (sum, item) =>
          sum +
          Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
            Math.max(item.quantity, 1),
        0,
      ),
    );

    const grossRevenue = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0),
    );

    const grossProfit = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
    );

    const refundAmount = toMoney(
      returns
        .filter((row) => ['approved', 'resolved'].includes(row.status))
        .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
    );

    const operatingExpenses = toMoney(
      expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
    );

    const netRevenue = toMoney(grossRevenue - refundAmount);
    const netProfitBeforeExpenses = toMoney(grossProfit - refundAmount);
    const netProfit = toMoney(netProfitBeforeExpenses - operatingExpenses);

    const openOrders = orders.filter((order) =>
      ['pending', 'approved', 'contacted'].includes(order.status),
    );

    const openReturns = returns.filter((row) =>
      ['requested', 'approved'].includes(row.status),
    );

    const openPurchaseOrders = purchaseOrders.filter((order) =>
      ['planned', 'approved', 'ordered', 'paid'].includes(order.status),
    );

    return {
      inventoryItems: inventory.length,
      activeInventoryItems: inventory.filter((item) => item.quantity > 0).length,
      watchlistItems: watchlist.length,
      activeWatchlistItems: watchlist.filter((item) => item.active).length,

      reserveRequests: reserves.length,
      pendingReserveRequests: reserves.filter((item) => item.status === 'pending')
        .length,

      orders: orders.length,
      openOrders: openOrders.length,
      soldOrders: orders.filter((item) => item.status === 'sold').length,
      openOrderValue: toMoney(
        openOrders.reduce((sum, order) => sum + Number(order.sellPrice ?? 0), 0),
      ),

      returns: returns.length,
      openReturns: openReturns.length,
      resolvedReturns: returns.filter((row) => row.status === 'resolved').length,
      refundAmount,

      purchaseOrders: purchaseOrders.length,
      openPurchaseOrders: openPurchaseOrders.length,
      receivedPurchaseOrders: purchaseOrders.filter(
        (item) => item.status === 'received',
      ).length,
      openPurchaseCost: toMoney(
        openPurchaseOrders.reduce(
          (sum, order) =>
            sum +
            Number(order.totalCost ?? order.actualPrice ?? order.plannedPrice ?? 0),
          0,
        ),
      ),

      expenses: expenses.length,
      operatingExpenses,

      reports: reports.length,
      latestReportAt: reports[0]?.createdAt ?? null,

      decisions: latestDecisions.length,
      buyNowDecisions: buyNowDecisions.length,
      repriceDecisions: repriceDecisions.length,

      unreadNotifications: notifications.length,

      totalInventoryCost,
      expectedInventoryValue,
      expectedInventoryProfit: toMoney(expectedInventoryValue - totalInventoryCost),
      grossRevenue,
      grossProfit,
      netRevenue,
      netProfitBeforeExpenses,
      netProfit,
      salesCount: sales.length,

      insights: {
        bestItems: bestItems.slice(0, 5),
        worstItems: worstItems.slice(0, 5),
        inventoryRisk: inventoryRisk.slice(0, 10),
        latestDecisions,
        buyNowDecisions,
        repriceDecisions,
      },
    };
  }

  async getMarketSnapshot(): Promise<unknown> {
    const [sources, listings, snapshots, decisions, errors] =
      await Promise.all([
        this.prisma.marketSource.findMany(),
        this.prisma.marketListing.findMany(),
        this.prisma.marketSnapshot.findMany({
          orderBy: { computedAt: 'desc' },
          take: 200,
        }),
        this.prisma.decisionSnapshot.findMany({
          orderBy: { createdAt: 'desc' },
          take: 200,
        }),
        this.prisma.syncErrorLog.findMany({
          orderBy: { createdAt: 'desc' },
          take: 50,
        }),
      ]);

    return {
      sources: sources.length,
      enabledSources: sources.filter((source) => source.enabled).length,
      listings: listings.length,
      activeListings: listings.filter((listing) => listing.status === 'active')
        .length,
      staleListings: listings.filter((listing) => listing.status === 'stale')
        .length,
      snapshots: snapshots.length,
      decisions: decisions.length,
      syncErrors: errors.length,
      failedSyncErrors: errors.filter((error) =>
        error.message.toLowerCase().includes('failed'),
      ).length,
    };
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