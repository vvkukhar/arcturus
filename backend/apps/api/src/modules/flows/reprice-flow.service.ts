import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { FlowsEventsService } from './flows-events.service';

@Injectable()
export class RepriceFlowService {
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

    return this.prisma.repriceFlowItem.findMany({
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
    const rows = await this.prisma.repriceFlowItem.findMany({
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
      inventoryItemId: row.inventoryItemId,
      itemId: row.inventoryItem.itemId,
      title: row.inventoryItem.titleSnapshot,
      setNumber: row.inventoryItem.item?.setNumber ?? '',
      currentPrice: row.currentPrice,
      suggestedPrice: row.suggestedPrice,
      totalCost: row.inventoryItem.totalCost,
      quantity: row.inventoryItem.quantity,
      assignedUserName: row.inventoryItem.assignedUser?.name ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }

  async add(body: {
    inventoryItemId: string;
    suggestedPrice?: number;
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

    const existing = await this.prisma.repriceFlowItem.findFirst({
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

    const basePrice =
      inventoryItem.expectedSalePriceManual ?? inventoryItem.totalCost;

    const suggestedPrice = body.suggestedPrice ?? basePrice;

    if (!Number.isFinite(suggestedPrice) || suggestedPrice <= 0) {
      throw new BadRequestException('suggestedPrice must be greater than zero');
    }

    const created = await this.prisma.repriceFlowItem.create({
      data: {
        inventoryItemId: body.inventoryItemId,
        currentPrice: basePrice,
        suggestedPrice,
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

    await this.activity.log('reprice_flow.added', {
      flowItemId: created.id,
      inventoryItemId: created.inventoryItemId,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
      suggestedPrice,
    });

    this.events.repriceChanged(created);

    return created;
  }

  async bulkAdd(inventoryItemIds: string[]): Promise<unknown> {
    const cleanIds = Array.from(new Set((inventoryItemIds ?? []).filter(Boolean)));

    if (cleanIds.length === 0) {
      throw new BadRequestException('inventoryItemIds are required');
    }

    const rows: unknown[] = [];

    for (const inventoryItemId of cleanIds) {
      rows.push(await this.add({ inventoryItemId }));
    }

    await this.activity.log('reprice_flow.bulk_added', {
      inventoryItemIds: cleanIds,
      count: rows.length,
    });

    this.events.repriceChanged({
      bulk: true,
      count: rows.length,
    });

    return {
      count: rows.length,
      rows,
    };
  }

  async markListed(body: {
    id: string;
    price: number;
  }): Promise<unknown> {
    if (!body.id) {
      throw new BadRequestException('Flow id is required');
    }

    if (!Number.isFinite(body.price) || body.price <= 0) {
      throw new BadRequestException('price must be greater than zero');
    }

    const flowItem = await this.prisma.repriceFlowItem.findUnique({
      where: {
        id: body.id,
      },
      include: {
        inventoryItem: true,
      },
    });

    if (!flowItem) {
      throw new NotFoundException('Reprice flow item not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const lockResult = await tx.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "InventoryItem" WHERE "id" = ${flowItem.inventoryItemId} FOR UPDATE
      `;
      
      if (!lockResult || lockResult.length === 0) throw new NotFoundException('Inventory lock failed');

      const inventoryItem = await tx.inventoryItem.update({
        where: {
          id: flowItem.inventoryItemId,
        },
        data: {
          expectedSalePriceManual: body.price,
        },
        include: {
          item: true,
          assignedUser: true,
        },
      });

      const updatedFlow = await tx.repriceFlowItem.update({
        where: {
          id: body.id,
        },
        data: {
          currentPrice: body.price,
          suggestedPrice: body.price,
          status: 'listed',
        },
      });

      return {
        inventoryItem,
        flowItem: updatedFlow,
      };
    });

    await this.activity.log('reprice_flow.mark_listed', {
      flowItemId: body.id,
      inventoryItemId: flowItem.inventoryItemId,
      itemId: flowItem.inventoryItem.itemId,
      title: flowItem.inventoryItem.titleSnapshot,
      price: body.price,
    });

    this.events.repriceChanged(result);
    this.events.inventoryChanged(result);
    this.events.itemChanged(flowItem.inventoryItem.itemId);
    this.events.opportunitiesChanged();

    return result;
  }

  async remove(id: string): Promise<unknown> {
    if (!id) {
      throw new BadRequestException('Flow id is required');
    }

    const existing = await this.prisma.repriceFlowItem.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItem: true,
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

    await this.activity.log('reprice_flow.removed', {
      flowItemId: id,
      inventoryItemId: existing.inventoryItemId,
      itemId: existing.inventoryItem.itemId,
      title: existing.inventoryItem.titleSnapshot,
    });

    this.events.repriceChanged({
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

    const result = await this.prisma.repriceFlowItem.deleteMany({
      where: {
        id: {
          in: cleanIds,
        },
      },
    });

    await this.activity.log('reprice_flow.bulk_removed', {
      ids: cleanIds,
      count: result.count,
    });

    this.events.repriceChanged({
      ids: cleanIds,
      deleted: true,
      count: result.count,
    });

    return result;
  }
}