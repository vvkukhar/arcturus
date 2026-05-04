import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class DecisionActionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  private async getDecision(id: string) {
    const decision = await this.prisma.decisionSnapshot.findUnique({
      where: { id },
      include: { item: true },
    });

    if (!decision) {
      throw new NotFoundException('Decision snapshot not found');
    }

    return decision;
  }

  async execute(decisionSnapshotId: string, note?: string | null): Promise<unknown> {
    const decision = await this.getDecision(decisionSnapshotId);

    if (decision.executionStatus === 'executed') {
      return decision;
    }

    if (decision.executionStatus === 'ignored') {
      throw new BadRequestException('Ignored decision cannot be executed');
    }

    let result: unknown = null;

    if (['BUY_NOW', 'BUY'].includes(decision.action)) {
      result = await this.executeBuyDecision(decision.id);
    } else if (['REPRICE_UP', 'REPRICE_UP_OR_REVIEW', 'SELL_FAST'].includes(decision.action)) {
      result = await this.executeInventoryDecision(decision.id);
    } else if (decision.action === 'SKIP' || decision.action === 'WATCH') {
      result = await this.markReviewed(decision.id, note ?? 'Decision reviewed without action');
    } else {
      throw new BadRequestException(`Unsupported decision action: ${decision.action}`);
    }

    const updated = await this.prisma.decisionSnapshot.update({
      where: { id: decision.id },
      data: {
        executionStatus: 'executed',
        executedAt: new Date(),
      },
    });

    await this.activity.log('decision.executed', {
      decisionSnapshotId: decision.id,
      action: decision.action,
      note: note ?? null,
    });

    this.realtime.emitCustom('decision.executed', updated);
    this.realtime.emitDashboardRefresh('decision_executed');

    return { decision: updated, result };
  }

  async ignore(decisionSnapshotId: string, note?: string | null): Promise<unknown> {
    const decision = await this.getDecision(decisionSnapshotId);

    const updated = await this.prisma.decisionSnapshot.update({
      where: { id: decision.id },
      data: {
        executionStatus: 'ignored',
        ignoredAt: new Date(),
        payloadJson: {
          ...((decision.payloadJson as Record<string, unknown>) ?? {}),
          ignoreNote: note ?? null,
        },
      },
    });

    await this.activity.log('decision.ignored', {
      decisionSnapshotId: decision.id,
      action: decision.action,
      note: note ?? null,
    });

    this.realtime.emitCustom('decision.ignored', updated);
    this.realtime.emitDashboardRefresh('decision_ignored');

    return updated;
  }

  async markReviewed(decisionSnapshotId: string, note?: string | null): Promise<unknown> {
    const decision = await this.getDecision(decisionSnapshotId);

    const updated = await this.prisma.decisionSnapshot.update({
      where: { id: decision.id },
      data: {
        executionStatus: 'reviewed',
        executedAt: new Date(),
        payloadJson: {
          ...((decision.payloadJson as Record<string, unknown>) ?? {}),
          reviewNote: note ?? null,
        },
      },
    });

    await this.activity.log('decision.reviewed', {
      decisionSnapshotId: decision.id,
      action: decision.action,
      note: note ?? null,
    });

    this.realtime.emitCustom('decision.reviewed', updated);
    this.realtime.emitDashboardRefresh('decision_reviewed');

    return updated;
  }

  async executeBuyDecision(decisionSnapshotId: string): Promise<unknown> {
    const decision = await this.getDecision(decisionSnapshotId);
    const payload = (decision.payloadJson as Record<string, any>) ?? {};

    const existingWatchlist = await this.prisma.watchlistItem.findFirst({
      where: { itemId: decision.itemId, active: true },
      orderBy: { createdAt: 'desc' },
    });

    const buyPrice = toMoney(Number(payload.buyPrice ?? payload.totalCost ?? 0));
    const targetSellPrice = toMoney(Number(payload.targetSellPrice ?? payload.avgSellPrice ?? 0));

    const watchlist =
      existingWatchlist ??
      (await this.prisma.watchlistItem.create({
        data: {
          itemId: decision.itemId,
          titleSnapshot: decision.item.title,
          desiredBuyPrice: buyPrice,
          maxBuyPrice: buyPrice,
          targetSellPrice: targetSellPrice > 0 ? targetSellPrice : null,
          active: true,
          priority: decision.action === 'BUY_NOW' ? 95 : 75,
          notes: `Created from decision ${decision.id}`,
        },
      }));

    const purchaseOrder = await this.prisma.purchaseOrder.create({
      data: {
        itemId: decision.itemId,
        watchlistItemId: watchlist.id,
        titleSnapshot: decision.item.title,
        status: decision.action === 'BUY_NOW' ? 'approved' : 'planned',
        plannedPrice: buyPrice > 0 ? buyPrice : null,
        shippingPrice: payload.shippingPrice != null ? toMoney(Number(payload.shippingPrice)) : null,
        totalCost: buyPrice > 0 ? toMoney(buyPrice + Number(payload.shippingPrice ?? 0)) : null,
        targetSellPrice: targetSellPrice > 0 ? targetSellPrice : null,
        quantity: 1,
        condition: decision.item.conditionDefault ?? 'used',
        sealed: false,
        notes: `Decision ${decision.action}: ${decision.reasonPrimary}`,
      },
    });

    const purchaseFlow = await this.prisma.purchaseFlowItem.create({
      data: {
        watchlistItemId: watchlist.id,
        selectedPrice: buyPrice > 0 ? buyPrice : null,
        status: 'pending',
        reason: `Decision engine: ${decision.reasonPrimary}`,
      },
    });

    await this.notifications.create({
      title: decision.action === 'BUY_NOW' ? 'BUY_NOW decision executed' : 'BUY decision executed',
      message: decision.item.title,
      type: 'decision',
      payloadJson: {
        decisionSnapshotId: decision.id,
        purchaseOrderId: purchaseOrder.id,
        purchaseFlowItemId: purchaseFlow.id,
      },
    });

    return { watchlist, purchaseOrder, purchaseFlow };
  }

  async executeInventoryDecision(decisionSnapshotId: string): Promise<unknown> {
    const decision = await this.getDecision(decisionSnapshotId);
    const payload = (decision.payloadJson as Record<string, any>) ?? {};
    const inventoryItemId = payload.inventoryItemId ?? decision.contextId;

    const inventory = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found for decision');
    }

    if (decision.action === 'SELL_FAST') {
      const reviewFlow = await this.prisma.reviewFlowItem.create({
        data: {
          inventoryItemId: inventory.id,
          status: 'pending',
          reason: `Decision engine SELL_FAST: ${decision.reasonPrimary}`,
        },
      });

      await this.notifications.create({
        title: 'SELL_FAST decision executed',
        message: inventory.titleSnapshot,
        type: 'decision',
        payloadJson: {
          decisionSnapshotId: decision.id,
          reviewFlowItemId: reviewFlow.id,
        },
      });

      return { reviewFlow };
    }

    const suggestedPrice = toMoney(
      Number(payload.targetPrice ?? payload.currentExpected ?? inventory.expectedSalePriceManual ?? 0),
    );

    const repriceFlow = await this.prisma.repriceFlowItem.create({
      data: {
        inventoryItemId: inventory.id,
        currentPrice: inventory.expectedSalePriceManual ?? null,
        suggestedPrice: suggestedPrice > 0 ? suggestedPrice : null,
        status: 'pending',
        reason: `Decision engine ${decision.action}: ${decision.reasonPrimary}`,
      },
    });

    await this.notifications.create({
      title: 'Reprice decision executed',
      message: inventory.titleSnapshot,
      type: 'decision',
      payloadJson: {
        decisionSnapshotId: decision.id,
        repriceFlowItemId: repriceFlow.id,
      },
    });

    return { repriceFlow };
  }

  async executeTopPending(limit = 20): Promise<unknown> {
    const decisions = await this.prisma.decisionSnapshot.findMany({
      where: {
        executionStatus: 'pending',
        action: { in: ['BUY_NOW', 'REPRICE_UP', 'REPRICE_UP_OR_REVIEW', 'SELL_FAST'] },
      },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
      take: limit,
    });

    const results = [];

    for (const decision of decisions) {
      try {
        const result = await this.execute(decision.id, 'Bulk top pending execution');
        results.push({ id: decision.id, ok: true, result });
      } catch (error) {
        results.push({
          id: decision.id,
          ok: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return { processed: results.length, results };
  }
}