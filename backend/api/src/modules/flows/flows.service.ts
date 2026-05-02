import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class FlowsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  async listPurchaseFlow(status?: string): Promise<unknown[]> {
    return this.prisma.purchaseFlowItem.findMany({
      where: {
        ...(status && status !== 'all' ? { status } : {}),
      },
      include: {
        watchlistItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToPurchaseFlow(watchlistItemId: string): Promise<unknown> {
    if (!watchlistItemId) {
      throw new BadRequestException('watchlistItemId is required');
    }

    const watchlistItem = await this.prisma.watchlistItem.findUnique({
      where: {
        id: watchlistItemId,
      },
      include: {
        item: true,
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException('Watchlist item not found');
    }

    const existing = await this.prisma.purchaseFlowItem.findFirst({
      where: {
        watchlistItemId,
        status: 'pending',
      },
    });

    if (existing) {
      return existing;
    }

    const created = await this.prisma.purchaseFlowItem.create({
      data: {
        watchlistItemId,
        selectedPrice: watchlistItem.maxBuyPrice,
        status: 'pending',
        reason: 'Added from buy opportunity',
      },
      include: {
        watchlistItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.purchase.added', {
      flowItemId: created.id,
      watchlistItemId,
      itemId: watchlistItem.itemId,
      title: watchlistItem.titleSnapshot,
    });

    this.realtime.emitFlowRefresh('purchase');
    this.realtime.emitDashboardRefresh('purchase_flow_added');

    return created;
  }

  async updatePurchaseFlow(params: {
    id: string;
    status?: string;
    selectedPrice?: number | null;
    reason?: string | null;
  }): Promise<unknown> {
    const existing = await this.prisma.purchaseFlowItem.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Purchase flow item not found');
    }

    const updated = await this.prisma.purchaseFlowItem.update({
      where: {
        id: params.id,
      },
      data: {
        status: params.status,
        selectedPrice: params.selectedPrice,
        reason: params.reason,
      },
      include: {
        watchlistItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.purchase.updated', {
      flowItemId: updated.id,
      status: updated.status,
    });

    this.realtime.emitFlowRefresh('purchase');
    this.realtime.emitDashboardRefresh('purchase_flow_updated');

    return updated;
  }

  async markPurchaseBought(id: string): Promise<unknown> {
    return this.updatePurchaseFlow({
      id,
      status: 'bought',
    });
  }

  async removePurchaseFlow(id: string): Promise<unknown> {
    const existing = await this.prisma.purchaseFlowItem.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Purchase flow item not found');
    }

    const deleted = await this.prisma.purchaseFlowItem.delete({
      where: {
        id,
      },
    });

    await this.activity.log('flow.purchase.removed', {
      flowItemId: id,
      watchlistItemId: existing.watchlistItemId,
    });

    this.realtime.emitFlowRefresh('purchase');
    this.realtime.emitDashboardRefresh('purchase_flow_removed');

    return deleted;
  }

  async listRepriceFlow(status?: string): Promise<unknown[]> {
    return this.prisma.repriceFlowItem.findMany({
      where: {
        ...(status && status !== 'all' ? { status } : {}),
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToRepriceFlow(inventoryItemId: string): Promise<unknown> {
    if (!inventoryItemId) {
      throw new BadRequestException('inventoryItemId is required');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: inventoryItemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const existing = await this.prisma.repriceFlowItem.findFirst({
      where: {
        inventoryItemId,
        status: 'pending',
      },
    });

    if (existing) {
      return existing;
    }

    const created = await this.prisma.repriceFlowItem.create({
      data: {
        inventoryItemId,
        currentPrice: inventoryItem.expectedSalePriceManual,
        suggestedPrice: inventoryItem.expectedSalePriceManual,
        status: 'pending',
        reason: 'Added from sell/reprice opportunity',
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.reprice.added', {
      flowItemId: created.id,
      inventoryItemId,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
    });

    this.realtime.emitFlowRefresh('reprice');
    this.realtime.emitDashboardRefresh('reprice_flow_added');

    return created;
  }

  async updateRepriceFlow(params: {
    id: string;
    status?: string;
    currentPrice?: number | null;
    suggestedPrice?: number | null;
    reason?: string | null;
  }): Promise<unknown> {
    const existing = await this.prisma.repriceFlowItem.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Reprice flow item not found');
    }

    const updated = await this.prisma.repriceFlowItem.update({
      where: {
        id: params.id,
      },
      data: {
        status: params.status,
        currentPrice: params.currentPrice,
        suggestedPrice: params.suggestedPrice,
        reason: params.reason,
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.reprice.updated', {
      flowItemId: updated.id,
      status: updated.status,
    });

    this.realtime.emitFlowRefresh('reprice');
    this.realtime.emitDashboardRefresh('reprice_flow_updated');

    return updated;
  }

  async markRepriceListed(id: string): Promise<unknown> {
    const flowItem = await this.prisma.repriceFlowItem.findUnique({
      where: {
        id,
      },
    });

    if (!flowItem) {
      throw new NotFoundException('Reprice flow item not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      if (flowItem.suggestedPrice != null) {
        await tx.inventoryItem.update({
          where: {
            id: flowItem.inventoryItemId,
          },
          data: {
            expectedSalePriceManual: flowItem.suggestedPrice,
          },
        });
      }

      return tx.repriceFlowItem.update({
        where: {
          id,
        },
        data: {
          status: 'listed',
        },
        include: {
          inventoryItem: {
            include: {
              item: true,
              assignedUser: true,
            },
          },
        },
      });
    });

    await this.activity.log('flow.reprice.listed', {
      flowItemId: updated.id,
      inventoryItemId: updated.inventoryItemId,
      suggestedPrice: updated.suggestedPrice,
    });

    this.realtime.emitFlowRefresh('reprice');
    this.realtime.emitInventoryRefresh({
      inventoryItemId: updated.inventoryItemId,
      reason: 'reprice_listed',
    });
    this.realtime.emitDashboardRefresh('reprice_flow_listed');
    this.realtime.emitOpportunityRefresh('reprice_flow_listed');

    return updated;
  }

  async removeRepriceFlow(id: string): Promise<unknown> {
    const existing = await this.prisma.repriceFlowItem.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Reprice flow item not found');
    }

    const deleted = await this.prisma.repriceFlowItem.delete({
      where: {
        id,
      },
    });

    await this.activity.log('flow.reprice.removed', {
      flowItemId: id,
      inventoryItemId: existing.inventoryItemId,
    });

    this.realtime.emitFlowRefresh('reprice');
    this.realtime.emitDashboardRefresh('reprice_flow_removed');

    return deleted;
  }

  async listReviewFlow(status?: string): Promise<unknown[]> {
    return this.prisma.reviewFlowItem.findMany({
      where: {
        ...(status && status !== 'all' ? { status } : {}),
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async addToReviewFlow(params: {
    inventoryItemId: string;
    reason?: string | null;
  }): Promise<unknown> {
    if (!params.inventoryItemId) {
      throw new BadRequestException('inventoryItemId is required');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const existing = await this.prisma.reviewFlowItem.findFirst({
      where: {
        inventoryItemId: params.inventoryItemId,
        status: 'pending',
      },
    });

    if (existing) {
      return existing;
    }

    const created = await this.prisma.reviewFlowItem.create({
      data: {
        inventoryItemId: params.inventoryItemId,
        reason: params.reason ?? 'Manual review required',
        status: 'pending',
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.review.added', {
      flowItemId: created.id,
      inventoryItemId: params.inventoryItemId,
      reason: created.reason,
    });

    this.realtime.emitFlowRefresh('review');
    this.realtime.emitDashboardRefresh('review_flow_added');

    return created;
  }

  async updateReviewFlow(params: {
    id: string;
    status?: string;
    reason?: string | null;
  }): Promise<unknown> {
    const existing = await this.prisma.reviewFlowItem.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Review flow item not found');
    }

    const updated = await this.prisma.reviewFlowItem.update({
      where: {
        id: params.id,
      },
      data: {
        status: params.status,
        reason: params.reason,
      },
      include: {
        inventoryItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
    });

    await this.activity.log('flow.review.updated', {
      flowItemId: updated.id,
      status: updated.status,
    });

    this.realtime.emitFlowRefresh('review');
    this.realtime.emitDashboardRefresh('review_flow_updated');

    return updated;
  }

  async markReviewDone(id: string): Promise<unknown> {
    return this.updateReviewFlow({
      id,
      status: 'reviewed',
    });
  }

  async removeReviewFlow(id: string): Promise<unknown> {
    const existing = await this.prisma.reviewFlowItem.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Review flow item not found');
    }

    const deleted = await this.prisma.reviewFlowItem.delete({
      where: {
        id,
      },
    });

    await this.activity.log('flow.review.removed', {
      flowItemId: id,
      inventoryItemId: existing.inventoryItemId,
    });

    this.realtime.emitFlowRefresh('review');
    this.realtime.emitDashboardRefresh('review_flow_removed');

    return deleted;
  }

  async clearCompleted(): Promise<unknown> {
    const [purchase, reprice, review] = await Promise.all([
      this.prisma.purchaseFlowItem.deleteMany({
        where: {
          status: {
            in: ['bought', 'removed', 'done'],
          },
        },
      }),
      this.prisma.repriceFlowItem.deleteMany({
        where: {
          status: {
            in: ['listed', 'removed', 'done'],
          },
        },
      }),
      this.prisma.reviewFlowItem.deleteMany({
        where: {
          status: {
            in: ['reviewed', 'removed', 'done'],
          },
        },
      }),
    ]);

    const result = {
      purchase: purchase.count,
      reprice: reprice.count,
      review: review.count,
    };

    await this.activity.log('flow.completed_cleared', result);

    this.realtime.emitFlowRefresh('all');
    this.realtime.emitDashboardRefresh('flow_completed_cleared');

    return result;
  }
}