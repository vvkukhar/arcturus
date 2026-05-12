import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { FlowsEventsService } from './flows-events.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class PurchaseFlowService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly events: FlowsEventsService,
    private readonly activity: ActivityService,
  ) {}

  async list(params?: {
    status?: string;
    q?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.purchaseFlowItem.findMany({
      where: {
        status: params?.status,
        watchlistItem:
          q && q.length > 0
            ? {
                OR: [
                  {
                    titleSnapshot: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                  {
                    item: {
                      title: {
                        contains: q,
                        mode: 'insensitive',
                      },
                    },
                  },
                  {
                    item: {
                      setNumber: {
                        contains: q,
                        mode: 'insensitive',
                      },
                    },
                  },
                ],
              }
            : undefined,
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        watchlistItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
      take: Math.min(params?.limit ?? 200, 500),
    });
  }

  async exportRows(): Promise<unknown[]> {
    const rows = await this.prisma.purchaseFlowItem.findMany({
      orderBy: {
        createdAt: 'asc',
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

    return rows.map((row) => ({
      id: row.id,
      status: row.status,
      selectedPrice: row.selectedPrice,
      selectedSource: row.reason,
      watchlistItemId: row.watchlistItemId,
      itemId: row.watchlistItem.itemId,
      title: row.watchlistItem.titleSnapshot,
      setNumber: row.watchlistItem.item?.setNumber ?? '',
      desiredBuyPrice: row.watchlistItem.desiredBuyPrice,
      maxBuyPrice: row.watchlistItem.maxBuyPrice,
      targetSellPrice: row.watchlistItem.targetSellPrice ?? '',
      assignedUserName: row.watchlistItem.assignedUser?.name ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async add(body: {
    watchlistItemId: string;
    selectedPrice?: number;
    selectedSource?: string;
  }): Promise<unknown> {
    if (!body.watchlistItemId) {
      throw new BadRequestException('watchlistItemId is required');
    }

    const watchlistItem = await this.prisma.watchlistItem.findUnique({
      where: {
        id: body.watchlistItemId,
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
        watchlistItemId: body.watchlistItemId,
        status: {
          in: ['queued', 'pending'],
        },
      },
    });

    if (existing) {
      return existing;
    }

    const selectedPrice =
      body.selectedPrice ??
      watchlistItem.desiredBuyPrice ??
      watchlistItem.maxBuyPrice;

    if (!Number.isFinite(selectedPrice) || selectedPrice <= 0) {
      throw new BadRequestException('selectedPrice must be greater than zero');
    }

    const created = await this.prisma.purchaseFlowItem.create({
      data: {
        watchlistItemId: body.watchlistItemId,
        selectedPrice,
        reason: body.selectedSource
          ? `Selected source: ${body.selectedSource}`
          : 'Selected source: manual',
        status: 'pending',
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

    await this.activity.log('purchase_flow.added', {
      flowItemId: created.id,
      watchlistItemId: created.watchlistItemId,
      itemId: watchlistItem.itemId,
      title: watchlistItem.titleSnapshot,
      selectedPrice,
    });

    this.events.purchaseChanged(created);

    return created;
  }

  async bulkAdd(watchlistItemIds: string[]): Promise<unknown> {
    const cleanIds = Array.from(new Set((watchlistItemIds ?? []).filter(Boolean)));

    if (cleanIds.length === 0) {
      throw new BadRequestException('watchlistItemIds are required');
    }

    const created: unknown[] = [];

    for (const watchlistItemId of cleanIds) {
      created.push(
        await this.add({
          watchlistItemId,
          selectedSource: 'bulk',
        }),
      );
    }

    await this.activity.log('purchase_flow.bulk_added', {
      count: created.length,
      watchlistItemIds: cleanIds,
    });

    this.events.purchaseChanged({
      bulk: true,
      count: created.length,
    });

    return {
      count: created.length,
      rows: created,
    };
  }

  async markBought(body: {
    id: string;
    purchasePrice: number;
    quantity: number;
    extraCosts?: number;
    condition?: string;
    completenessPercent?: number;
    sealed?: boolean;
    notes?: string;
  }): Promise<unknown> {
    if (!body.id) {
      throw new BadRequestException('Flow id is required');
    }

    if (!Number.isFinite(body.purchasePrice) || body.purchasePrice <= 0) {
      throw new BadRequestException('purchasePrice must be greater than zero');
    }

    if (!Number.isInteger(body.quantity) || body.quantity <= 0) {
      throw new BadRequestException('quantity must be a positive integer');
    }

    const extraCosts = body.extraCosts ?? 0;

    if (!Number.isFinite(extraCosts) || extraCosts < 0) {
      throw new BadRequestException('extraCosts must be a non-negative number');
    }

    const completenessPercent = body.completenessPercent ?? 100;

    if (
      !Number.isInteger(completenessPercent) ||
      completenessPercent < 0 ||
      completenessPercent > 100
    ) {
      throw new BadRequestException('completenessPercent must be from 0 to 100');
    }

    const flowItem = await this.prisma.purchaseFlowItem.findUnique({
      where: {
        id: body.id,
      },
      include: {
        watchlistItem: true,
      },
    });

    if (!flowItem) {
      throw new NotFoundException('Purchase flow item not found');
    }

    const totalCost = body.purchasePrice + extraCosts;

    const result = await this.prisma.$transaction(async (tx) => {
      const lockResult = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "WatchlistItem" WHERE "id" = ${flowItem.watchlistItemId} FOR UPDATE
      `;
      
      if (!lockResult || lockResult.length === 0) throw new NotFoundException('Watchlist lock failed');

      const inventoryItem = await tx.inventoryItem.create({
        data: {
          itemId: flowItem.watchlistItem.itemId,
          titleSnapshot: flowItem.watchlistItem.titleSnapshot,
          purchasePrice: body.purchasePrice,
          totalCost,
          quantity: body.quantity,
          condition: body.condition ?? 'used',
          sealed: body.sealed ?? false,
          expectedSalePriceManual: flowItem.watchlistItem.targetSellPrice ?? null,
          notes: body.notes,
          assignedUserId: flowItem.watchlistItem.assignedUserId,
        },
        include: {
          item: true,
          assignedUser: true,
        },
      });

      const updatedFlow = await tx.purchaseFlowItem.update({
        where: {
          id: body.id,
        },
        data: {
          selectedPrice: body.purchasePrice,
          status: 'bought',
        },
        include: {
          watchlistItem: true,
        },
      });

      await tx.watchlistItem.update({
        where: {
          id: flowItem.watchlistItemId,
        },
        data: {
          active: false,
        },
      });

      return {
        inventoryItem,
        flowItem: updatedFlow,
      };
    });

    await this.activity.log('purchase_flow.mark_bought', {
      flowItemId: body.id,
      watchlistItemId: flowItem.watchlistItemId,
      itemId: flowItem.watchlistItem.itemId,
      title: flowItem.watchlistItem.titleSnapshot,
      purchasePrice: body.purchasePrice,
      extraCosts,
      totalCost,
      quantity: body.quantity,
    });

    this.events.purchaseChanged(result);
    this.events.inventoryChanged(result);
    this.events.watchlistChanged({
      id: flowItem.watchlistItemId,
      active: false,
    });
    this.events.itemChanged(flowItem.watchlistItem.itemId);
    this.events.opportunitiesChanged();

    return result;
  }

  async remove(id: string): Promise<unknown> {
    if (!id) {
      throw new BadRequestException('Flow id is required');
    }

    const existing = await this.prisma.purchaseFlowItem.findUnique({
      where: {
        id,
      },
      include: {
        watchlistItem: true,
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

    await this.activity.log('purchase_flow.removed', {
      flowItemId: id,
      watchlistItemId: existing.watchlistItemId,
      itemId: existing.watchlistItem.itemId,
      title: existing.watchlistItem.titleSnapshot,
    });

    this.events.purchaseChanged({
      id,
      deleted: true,
    });

    return deleted;
  }

  async bulkRemove(ids: string[]): Promise<unknown> {
    const cleanIds = Array.from(new Set((ids ?? []).filter(Boolean)));

    if (cleanIds.length === 0) {
      throw new BadRequestException('ids are required');
    }

    const result = await this.prisma.purchaseFlowItem.deleteMany({
      where: {
        id: {
          in: cleanIds,
        },
      },
    });

    await this.activity.log('purchase_flow.bulk_removed', {
      ids: cleanIds,
      count: result.count,
    });

    this.events.purchaseChanged({
      ids: cleanIds,
      deleted: true,
      count: result.count,
    });

    return result;
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

    this.events.purchaseChanged(updated);

    return updated;
  }
}