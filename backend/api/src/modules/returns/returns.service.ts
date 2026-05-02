import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateReturnDto } from './dto/create-return.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async list(params?: {
    status?: string;
    q?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.returnRequest.findMany({
      where: {
        ...(params?.status && params.status !== 'all'
          ? {
              status: params.status,
            }
          : {}),
        ...(q
          ? {
              OR: [
                {
                  reason: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  sale: {
                    buyerName: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  inventoryItem: {
                    titleSnapshot: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        sale: true,
        order: true,
        inventoryItem: {
          include: {
            item: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.limit ?? 200,
    });
  }

  async getById(id: string): Promise<unknown> {
    const row = await this.prisma.returnRequest.findUnique({
      where: {
        id,
      },
      include: {
        sale: true,
        order: true,
        inventoryItem: {
          include: {
            item: true,
            location: {
              include: {
                warehouse: true,
              },
            },
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
    });

    if (!row) {
      throw new NotFoundException('Return request not found');
    }

    return row;
  }

  async create(dto: CreateReturnDto): Promise<unknown> {
    const sale = await this.prisma.sale.findUnique({
      where: {
        id: dto.saleId,
      },
      include: {
        inventoryItem: true,
      },
    });

    if (!sale) {
      throw new NotFoundException('Sale not found');
    }

    if (dto.orderId) {
      const order = await this.prisma.order.findUnique({
        where: {
          id: dto.orderId,
        },
      });

      if (!order) {
        throw new NotFoundException('Order not found');
      }
    }

    const quantity = dto.quantity ?? sale.quantity;

    if (quantity > sale.quantity) {
      throw new BadRequestException('Return quantity exceeds sale quantity');
    }

    const created = await this.prisma.returnRequest.create({
      data: {
        saleId: sale.id,
        orderId: dto.orderId ?? null,
        inventoryItemId: sale.inventoryItemId,
        status: 'requested',
        reason: dto.reason ?? null,
        refundAmount:
          dto.refundAmount != null ? toMoney(dto.refundAmount) : sale.sellPrice,
        restock: dto.restock ?? true,
        quantity,
        adminNote: dto.adminNote ?? null,
      },
      include: {
        sale: true,
        order: true,
        inventoryItem: true,
      },
    });

    await this.activity.log('return.created', {
      returnRequestId: created.id,
      saleId: sale.id,
      inventoryItemId: sale.inventoryItemId,
      quantity,
    });

    await this.notifications.create({
      title: 'Return requested',
      message: `${sale.inventoryItem.titleSnapshot} • ${sale.buyerName ?? 'buyer'}`,
      type: 'return',
      payloadJson: {
        returnRequestId: created.id,
        saleId: sale.id,
      },
    });

    this.realtime.emitCustom('return.created', created);
    this.realtime.emitDashboardRefresh('return_created');

    return created;
  }

  async update(dto: UpdateReturnDto): Promise<unknown> {
    const existing = await this.prisma.returnRequest.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Return request not found');
    }

    const updated = await this.prisma.returnRequest.update({
      where: {
        id: dto.id,
      },
      data: {
        status: dto.status,
        reason: dto.reason,
        refundAmount:
          dto.refundAmount === undefined
            ? undefined
            : dto.refundAmount === null
              ? null
              : toMoney(dto.refundAmount),
        restock: dto.restock,
        quantity: dto.quantity,
        adminNote: dto.adminNote,
      },
      include: {
        sale: true,
        order: true,
        inventoryItem: true,
      },
    });

    await this.activity.log('return.updated', {
      returnRequestId: updated.id,
      status: updated.status,
    });

    this.realtime.emitCustom('return.updated', updated);
    this.realtime.emitDashboardRefresh('return_updated');

    return updated;
  }

  async approve(id: string): Promise<unknown> {
    return this.update({
      id,
      status: 'approved',
    });
  }

  async reject(id: string, adminNote?: string | null): Promise<unknown> {
    return this.update({
      id,
      status: 'rejected',
      adminNote: adminNote ?? null,
    });
  }

  async resolve(id: string): Promise<unknown> {
    const existing = await this.prisma.returnRequest.findUnique({
      where: {
        id,
      },
      include: {
        sale: true,
        order: true,
        inventoryItem: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Return request not found');
    }

    if (existing.status === 'resolved') {
      return this.getById(id);
    }

    const result = await this.prisma.$transaction(async (tx) => {
      if (existing.restock) {
        await tx.inventoryItem.update({
          where: {
            id: existing.inventoryItemId,
          },
          data: {
            quantity: {
              increment: existing.quantity,
            },
          },
        });

        await tx.stockMovement.create({
          data: {
            inventoryItemId: existing.inventoryItemId,
            warehouseId: existing.inventoryItem.warehouseId ?? null,
            fromStorageLocationId: null,
            toStorageLocationId: existing.inventoryItem.storageLocationId ?? null,
            type: 'return_restock',
            quantity: existing.quantity,
            reason: `Return resolved ${existing.id}`,
          },
        });
      }

      if (existing.orderId) {
        await tx.order.update({
          where: {
            id: existing.orderId,
          },
          data: {
            status: 'returned',
          },
        });
      }

      const updated = await tx.returnRequest.update({
        where: {
          id,
        },
        data: {
          status: 'resolved',
          resolvedAt: new Date(),
        },
        include: {
          sale: true,
          order: true,
          inventoryItem: true,
        },
      });

      return updated;
    });

    await this.activity.log('return.resolved', {
      returnRequestId: result.id,
      saleId: result.saleId,
      inventoryItemId: result.inventoryItemId,
      restock: result.restock,
      quantity: result.quantity,
      refundAmount: result.refundAmount,
    });

    this.realtime.emitCustom('return.resolved', result);
    this.realtime.emitInventoryRefresh({
      inventoryItemId: result.inventoryItemId,
      reason: 'return_resolved',
    });
    this.realtime.emitDashboardRefresh('return_resolved');

    return result;
  }

  async stats(): Promise<unknown> {
    const rows = await this.prisma.returnRequest.findMany();

    return {
      total: rows.length,
      requested: rows.filter((row) => row.status === 'requested').length,
      approved: rows.filter((row) => row.status === 'approved').length,
      rejected: rows.filter((row) => row.status === 'rejected').length,
      resolved: rows.filter((row) => row.status === 'resolved').length,
      totalRefundAmount: toMoney(
        rows
          .filter((row) => ['approved', 'resolved'].includes(row.status))
          .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
      ),
    };
  }

  async board(): Promise<{
    requested: unknown[];
    approved: unknown[];
    rejected: unknown[];
    resolved: unknown[];
  }> {
    const rows = await this.prisma.returnRequest.findMany({
      include: {
        sale: true,
        order: true,
        inventoryItem: {
          include: {
            item: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 300,
    });

    return {
      requested: rows.filter((row) => row.status === 'requested'),
      approved: rows.filter((row) => row.status === 'approved'),
      rejected: rows.filter((row) => row.status === 'rejected'),
      resolved: rows.filter((row) => row.status === 'resolved'),
    };
  }
}