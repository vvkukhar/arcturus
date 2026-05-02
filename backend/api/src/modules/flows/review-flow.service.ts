import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { FlowsEventsService } from './flows-events.service';

@Injectable()
export class ReviewFlowService {
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

    return this.prisma.reviewFlowItem.findMany({
      where: {
        status: params?.status,
        inventoryItem:
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
        inventoryItem: {
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
    const rows = await this.prisma.reviewFlowItem.findMany({
      orderBy: {
        createdAt: 'asc',
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

    return rows.map((row) => ({
      id: row.id,
      status: row.status,
      reason: row.reason ?? '',
      inventoryItemId: row.inventoryItemId,
      itemId: row.inventoryItem.itemId,
      title: row.inventoryItem.titleSnapshot,
      setNumber: row.inventoryItem.item?.setNumber ?? '',
      quantity: row.inventoryItem.quantity,
      totalCost: row.inventoryItem.totalCost,
      assignedUserName: row.inventoryItem.assignedUser?.name ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async add(body: {
    inventoryItemId: string;
    reason?: string;
  }): Promise<unknown> {
    if (!body.inventoryItemId) {
      throw new BadRequestException('inventoryItemId is required');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: body.inventoryItemId,
      },
      include: {
        item: true,
        assignedUser: true,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const existing = await this.prisma.reviewFlowItem.findFirst({
      where: {
        inventoryItemId: body.inventoryItemId,
        status: {
          in: ['queued', 'pending'],
        },
      },
    });

    if (existing) {
      return existing;
    }

    const created = await this.prisma.reviewFlowItem.create({
      data: {
        inventoryItemId: body.inventoryItemId,
        reason: body.reason?.trim() || 'Manual review requested',
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

    await this.activity.log('review_flow.added', {
      flowItemId: created.id,
      inventoryItemId: created.inventoryItemId,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
      reason: created.reason,
    });

    this.events.reviewChanged(created);

    return created;
  }

  async bulkAdd(inventoryItemIds: string[], reason?: string): Promise<unknown> {
    const cleanIds = Array.from(new Set((inventoryItemIds ?? []).filter(Boolean)));

    if (cleanIds.length === 0) {
      throw new BadRequestException('inventoryItemIds are required');
    }

    const rows: unknown[] = [];

    for (const inventoryItemId of cleanIds) {
      rows.push(
        await this.add({
          inventoryItemId,
          reason,
        }),
      );
    }

    await this.activity.log('review_flow.bulk_added', {
      inventoryItemIds: cleanIds,
      reason,
      count: rows.length,
    });

    this.events.reviewChanged({
      bulk: true,
      count: rows.length,
    });

    return {
      count: rows.length,
      rows,
    };
  }

  async markReviewed(body: {
    id: string;
    note?: string;
  }): Promise<unknown> {
    if (!body.id) {
      throw new BadRequestException('Flow id is required');
    }

    const flowItem = await this.prisma.reviewFlowItem.findUnique({
      where: {
        id: body.id,
      },
      include: {
        inventoryItem: true,
      },
    });

    if (!flowItem) {
      throw new NotFoundException('Review flow item not found');
    }

    const updated = await this.prisma.reviewFlowItem.update({
      where: {
        id: body.id,
      },
      data: {
        status: 'reviewed',
        reason: body.note?.trim() || flowItem.reason,
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

    await this.activity.log('review_flow.mark_reviewed', {
      flowItemId: body.id,
      inventoryItemId: flowItem.inventoryItemId,
      itemId: flowItem.inventoryItem.itemId,
      title: flowItem.inventoryItem.titleSnapshot,
      note: body.note,
    });

    this.events.reviewChanged(updated);
    this.events.itemChanged(flowItem.inventoryItem.itemId);

    return updated;
  }

  async remove(id: string): Promise<unknown> {
    if (!id) {
      throw new BadRequestException('Flow id is required');
    }

    const existing = await this.prisma.reviewFlowItem.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItem: true,
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

    await this.activity.log('review_flow.removed', {
      flowItemId: id,
      inventoryItemId: existing.inventoryItemId,
      itemId: existing.inventoryItem.itemId,
      title: existing.inventoryItem.titleSnapshot,
    });

    this.events.reviewChanged({
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

    const result = await this.prisma.reviewFlowItem.deleteMany({
      where: {
        id: {
          in: cleanIds,
        },
      },
    });

    await this.activity.log('review_flow.bulk_removed', {
      ids: cleanIds,
      count: result.count,
    });

    this.events.reviewChanged({
      ids: cleanIds,
      deleted: true,
      count: result.count,
    });

    return result;
  }
}