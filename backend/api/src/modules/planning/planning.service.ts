import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DailyPlanService } from '../strategy/daily-plan.service';

@Injectable()
export class PlanningService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dailyPlanService: DailyPlanService,
  ) {}

  async getDailyPlan(): Promise<unknown[]> {
    const [
      purchasePending,
      repricePending,
      reviewPending,
      unresolvedPending,
      ordersPending,
      returnsOpen,
      procurementOpen,
      latestReport,
      buyNowDecisions,
      repriceDecisions,
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
      this.prisma.reportSnapshot.findFirst({
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

    const sources = await this.prisma.marketSource.findMany({
      select: {
        id: true,
      },
    });

    let staleSources = 0;

    for (const source of sources) {
      const latestListing = await this.prisma.marketListing.findFirst({
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

      if (!latestListing) {
        staleSources += 1;
        continue;
      }

      const diffHours =
        (Date.now() - latestListing.fetchedAt.getTime()) / (1000 * 60 * 60);

      if (diffHours > 24) {
        staleSources += 1;
      }
    }

    const basePlan = await this.dailyPlanService.generate({
      buyCount: purchasePending,
      sellCount: repricePending,
      reviewCount: reviewPending,
      unresolvedCount: unresolvedPending,
      staleSources,
    });

    const extraTasks = [];

    if (buyNowDecisions > 0) {
      extraTasks.push({
        order: 0,
        type: 'buy',
        title: `Review ${buyNowDecisions} BUY_NOW decisions`,
        reason: 'Decision engine found high-priority buy opportunities',
      });
    }

    if (repriceDecisions > 0) {
      extraTasks.push({
        order: 0,
        type: 'sell',
        title: `Review ${repriceDecisions} repricing decisions`,
        reason: 'Some inventory has weak expected ROI or needs price correction',
      });
    }

    if (ordersPending > 0) {
      extraTasks.push({
        order: 0,
        type: 'operator',
        title: `Process ${ordersPending} open customer orders`,
        reason: 'Open orders are closest to cash conversion',
      });
    }

    if (returnsOpen > 0) {
      extraTasks.push({
        order: 0,
        type: 'review',
        title: `Resolve ${returnsOpen} return/refund requests`,
        reason: 'Returns affect inventory accuracy and real profit',
      });
    }

    if (procurementOpen > 0) {
      extraTasks.push({
        order: 0,
        type: 'buy',
        title: `Move ${procurementOpen} purchase orders forward`,
        reason: 'Procurement pipeline controls future inventory growth',
      });
    }

    const reportIsStale =
      !latestReport ||
      (Date.now() - latestReport.createdAt.getTime()) / (1000 * 60 * 60 * 24) > 7;

    if (reportIsStale) {
      extraTasks.push({
        order: 0,
        type: 'finance',
        title: 'Create fresh financial report snapshot',
        reason: 'P&L snapshot is missing or older than 7 days',
      });
    }

    return [...extraTasks, ...basePlan].map((task: any, index) => ({
      ...task,
      order: index + 1,
    }));
  }

  async getExecutionPressure(): Promise<unknown> {
    const dailyPlan = await this.getDailyPlan();

    const [
      purchase,
      reprice,
      review,
      unresolved,
      orders,
      returns,
      procurement,
      reports,
      buyNowDecisions,
      repriceDecisions,
      errors,
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
      this.prisma.syncErrorLog.count(),
    ]);

    const pressureScore =
      purchase * 2 +
      reprice * 2 +
      review * 1.5 +
      unresolved * 3 +
      orders * 3 +
      returns * 3 +
      procurement * 2 +
      buyNowDecisions * 2 +
      repriceDecisions * 2 +
      (reports === 0 ? 3 : 0) +
      errors * 0.5;

    let tier: 'low' | 'medium' | 'high' | 'critical' = 'low';

    if (pressureScore >= 40) {
      tier = 'critical';
    } else if (pressureScore >= 20) {
      tier = 'high';
    } else if (pressureScore >= 8) {
      tier = 'medium';
    }

    return {
      pressureScore: Number(pressureScore.toFixed(2)),
      tier,
      counters: {
        purchase,
        reprice,
        review,
        unresolved,
        orders,
        returns,
        procurement,
        reports,
        buyNowDecisions,
        repriceDecisions,
        errors,
      },
      dailyPlan,
    };
  }
}