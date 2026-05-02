import { Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class PublicStoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 120);
  }

  async getCatalog(params?: {
    q?: string;
    type?: string;
    theme?: string;
    sort?: string;
    availableOnly?: boolean;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    const orderBy =
      params?.sort === 'price_asc'
        ? [{ expectedSalePriceManual: 'asc' as const }]
        : params?.sort === 'price_desc'
          ? [{ expectedSalePriceManual: 'desc' as const }]
          : params?.sort === 'title_asc'
            ? [{ titleSnapshot: 'asc' as const }]
            : [{ createdAt: 'desc' as const }];

    return this.prisma.inventoryItem.findMany({
      where: {
        ...(params?.availableOnly
          ? {
              quantity: {
                gt: 0,
              },
            }
          : {}),
        ...(params?.type && params.type !== 'all'
          ? {
              item: {
                kind: params.type,
              },
            }
          : {}),
        ...(params?.theme
          ? {
              item: {
                theme: {
                  contains: params.theme,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
        ...(q
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
          : {}),
      },
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
      orderBy,
      take: params?.limit ?? 200,
    });
  }

  async getCatalogItem(slug: string): Promise<unknown> {
    const rows = await this.prisma.inventoryItem.findMany({
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
      orderBy: {
        createdAt: 'desc',
      },
      take: 500,
    });

    const found = rows.find((row) => {
      const title = row.titleSnapshot || row.item?.title || row.id;
      return this.slugify(title) === slug || row.id === slug;
    });

    if (!found) {
      throw new NotFoundException('Product not found');
    }

    const related = await this.prisma.inventoryItem.findMany({
      where: {
        id: {
          not: found.id,
        },
        item: {
          theme: found.item?.theme ?? undefined,
        },
        quantity: {
          gt: 0,
        },
      },
      include: {
        item: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      take: 8,
    });

    return {
      ...found,
      slug: this.slugify(found.titleSnapshot || found.item?.title || found.id),
      related,
    };
  }

  async analytics(): Promise<unknown> {
    const [inventory, reserves, sales, orders] = await Promise.all([
      this.prisma.inventoryItem.findMany(),
      this.prisma.reserveRequest.findMany(),
      this.prisma.sale.findMany(),
      this.prisma.order.findMany(),
    ]);

    return {
      totalInventory: inventory.length,
      availableInventory: inventory.filter((row) => row.quantity > 0).length,
      soldInventory: inventory.filter((row) => row.quantity <= 0).length,
      reserveRequests: reserves.length,
      pendingReserveRequests: reserves.filter((row) => row.status === 'pending')
        .length,
      orders: orders.length,
      pendingOrders: orders.filter((row) => row.status === 'pending').length,
      openOrders: orders.filter((row) =>
        ['pending', 'approved', 'contacted'].includes(row.status),
      ).length,
      salesCount: sales.length,
      totalSalesProfit: toMoney(
        sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
      ),
    };
  }

  async createReserve(params: {
    inventoryItemId?: string | null;
    productTitle: string;
    name: string;
    contact: string;
    message?: string | null;
  }): Promise<unknown> {
    const inventoryItem = params.inventoryItemId
      ? await this.prisma.inventoryItem.findUnique({
          where: {
            id: params.inventoryItemId,
          },
        })
      : null;

    const result = await this.prisma.$transaction(async (tx) => {
      const reserve = await tx.reserveRequest.create({
        data: {
          inventoryItemId: params.inventoryItemId ?? null,
          productTitle: params.productTitle,
          name: params.name,
          contact: params.contact,
          message: params.message ?? null,
          status: 'pending',
        },
      });

      const order = await tx.order.create({
        data: {
          reserveRequestId: reserve.id,
          inventoryItemId: reserve.inventoryItemId,
          productTitle: reserve.productTitle,
          buyerName: reserve.name,
          contact: reserve.contact,
          status: 'pending',
          sellPrice: inventoryItem?.expectedSalePriceManual ?? null,
          quantity: 1,
          channel: 'public_store',
          adminNote: reserve.message ?? null,
        },
      });

      return {
        reserve,
        order,
      };
    });

    await this.activity.log('reserve.created', {
      reserveRequestId: result.reserve.id,
      orderId: result.order.id,
      inventoryItemId: result.reserve.inventoryItemId,
      productTitle: result.reserve.productTitle,
      name: result.reserve.name,
      contact: result.reserve.contact,
    });

    await this.notifications.create({
      title: 'New reserve request',
      message: `${result.reserve.productTitle} • ${result.reserve.name}`,
      type: 'reserve',
      payloadJson: {
        reserveRequestId: result.reserve.id,
        orderId: result.order.id,
      },
    });

    this.realtime.emitCustom('reserve.created', result.reserve);
    this.realtime.emitCustom('order.created', result.order);
    this.realtime.emitDashboardRefresh('reserve_created');

    return result.reserve;
  }

  async listReserveRequests(params?: {
    q?: string;
    status?: string;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.reserveRequest.findMany({
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
                  productTitle: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  name: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  contact: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        orders: true,
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
      take: 200,
    });
  }

  async getReserveRequest(id: string): Promise<unknown> {
    const row = await this.prisma.reserveRequest.findUnique({
      where: {
        id,
      },
      include: {
        orders: true,
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
    });

    if (!row) {
      throw new NotFoundException('Reserve request not found');
    }

    return row;
  }

  async updateReserveRequest(params: {
    id: string;
    status?: string;
    adminNote?: string | null;
  }): Promise<unknown> {
    const existing = await this.prisma.reserveRequest.findUnique({
      where: {
        id: params.id,
      },
      include: {
        orders: true,
      },
    });

    if (!existing) {
      throw new NotFoundException('Reserve request not found');
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      const reserve = await tx.reserveRequest.update({
        where: {
          id: params.id,
        },
        data: {
          status: params.status,
          adminNote: params.adminNote,
        },
      });

      if (params.status && existing.orders.length > 0) {
        await tx.order.updateMany({
          where: {
            reserveRequestId: params.id,
          },
          data: {
            status:
              params.status === 'approved'
                ? 'approved'
                : params.status === 'contacted'
                  ? 'contacted'
                  : params.status === 'rejected'
                    ? 'cancelled'
                    : params.status,
            adminNote: params.adminNote,
          },
        });
      }

      return reserve;
    });

    await this.activity.log('reserve.updated', {
      reserveRequestId: updated.id,
      status: updated.status,
      adminNote: updated.adminNote,
    });

    this.realtime.emitCustom('reserve.updated', updated);
    this.realtime.emitDashboardRefresh('reserve_updated');

    return updated;
  }

  async reserveBoard(): Promise<{
    pending: unknown[];
    approved: unknown[];
    contacted: unknown[];
    rejected: unknown[];
    sold: unknown[];
  }> {
    const rows = await this.prisma.reserveRequest.findMany({
      include: {
        orders: true,
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
    });

    return {
      pending: rows.filter((row) => row.status === 'pending'),
      approved: rows.filter((row) => row.status === 'approved'),
      contacted: rows.filter((row) => row.status === 'contacted'),
      rejected: rows.filter((row) => row.status === 'rejected'),
      sold: rows.filter((row) => row.status === 'sold'),
    };
  }
}