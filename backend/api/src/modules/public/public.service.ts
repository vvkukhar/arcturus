import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class PublicService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  private slugify(value: string): string {
    return value
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]+/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private resolveOrderBy(sort?: string):
    | { expectedSalePriceManual: 'asc' | 'desc' }
    | { titleSnapshot: 'asc' | 'desc' }
    | { createdAt: 'asc' | 'desc' } {
    if (sort === 'price_asc') {
      return { expectedSalePriceManual: 'asc' };
    }

    if (sort === 'price_desc') {
      return { expectedSalePriceManual: 'desc' };
    }

    if (sort === 'title_asc') {
      return { titleSnapshot: 'asc' };
    }

    if (sort === 'title_desc') {
      return { titleSnapshot: 'desc' };
    }

    return { createdAt: 'desc' };
  }

  async getCatalog(params: {
    q?: string;
    type?: string;
    availableOnly?: boolean;
    theme?: string;
    sort?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const limit = Math.min(params.limit ?? 48, 200);
    const q = params.q?.trim();

    return this.prisma.inventoryItem.findMany({
      where: {
        quantity: params.availableOnly === true ? { gt: 0 } : undefined,
        OR:
          q && q.length > 0
            ? [
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
                {
                  item: {
                    theme: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
              ]
            : undefined,
        item: {
          ...(params.type ? { kind: params.type } : {}),
          ...(params.theme
            ? {
                theme: {
                  equals: params.theme,
                  mode: 'insensitive',
                },
              }
            : {}),
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
      orderBy: this.resolveOrderBy(params.sort),
      take: limit,
    });
  }

  async getCatalogItemBySlug(slug: string): Promise<unknown | null> {
    const normalized = slug.trim().toLowerCase();

    const all = await this.prisma.inventoryItem.findMany({
      where: {
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
        assignedUser: true,
      },
      take: 500,
    });

    const found = all.find((entry) => {
      const title = entry.titleSnapshot || entry.item?.title || entry.id;
      const generated = this.slugify(title);

      return generated === normalized || entry.id === normalized;
    });

    return found ?? null;
  }

  async getRelatedCatalogItems(params: {
    slug: string;
    limit?: number;
  }): Promise<unknown[]> {
    const item = (await this.getCatalogItemBySlug(params.slug)) as any | null;

    if (!item) {
      return [];
    }

    const theme = item.item?.theme ?? null;
    const kind = item.item?.kind ?? null;

    return this.prisma.inventoryItem.findMany({
      where: {
        id: {
          not: item.id,
        },
        quantity: {
          gt: 0,
        },
        item: {
          ...(theme ? { theme } : {}),
          ...(kind ? { kind } : {}),
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
      orderBy: {
        createdAt: 'desc',
      },
      take: Math.min(params.limit ?? 8, 24),
    });
  }

  async createReserveRequest(body: {
    inventoryItemId?: string;
    productTitle?: string;
    name: string;
    contact: string;
    message?: string;
  }): Promise<unknown> {
    const name = body.name.trim();
    const contact = body.contact.trim();
    const message = body.message?.trim() ?? '';

    let productTitle = body.productTitle?.trim() ?? '';
    let inventoryItemId = body.inventoryItemId;

    if (inventoryItemId) {
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

      productTitle =
        productTitle ||
        inventoryItem.titleSnapshot ||
        inventoryItem.item?.title ||
        inventoryItem.id;
    }

    if (!productTitle) {
      throw new BadRequestException('Product title is required');
    }

    const created = await this.prisma.reserveRequest.create({
      data: {
        inventoryItemId,
        productTitle,
        name,
        contact,
        message,
        status: 'pending',
      },
    });

    this.realtime.emitCustom('reserve.created', created);
    this.realtime.emitDashboardRefresh('reserve_created');

    return created;
  }

  async getReserveRequests(params?: {
    q?: string;
    status?: string;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.reserveRequest.findMany({
      where: {
        ...(params?.status && params.status !== 'all'
          ? { status: params.status }
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
                {
                  message: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 500,
    });
  }

  async updateReserveRequest(body: {
    id: string;
    status?: string;
    adminNote?: string | null;
  }): Promise<unknown> {
    if (!body.id) {
      throw new BadRequestException('Reserve request id is required');
    }

    const existing = await this.prisma.reserveRequest.findUnique({
      where: {
        id: body.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Reserve request not found');
    }

    const updated = await this.prisma.reserveRequest.update({
      where: {
        id: body.id,
      },
      data: {
        status: body.status,
        adminNote: body.adminNote,
      },
    });

    this.realtime.emitCustom('reserve.updated', updated);
    this.realtime.emitDashboardRefresh('reserve_updated');

    return updated;
  }

  async getReserveBoard(): Promise<unknown> {
    const rows = await this.prisma.reserveRequest.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 500,
    });

    return {
      pending: rows.filter((x) => x.status === 'pending'),
      approved: rows.filter((x) => x.status === 'approved'),
      contacted: rows.filter((x) => x.status === 'contacted'),
      rejected: rows.filter((x) => x.status === 'rejected'),
      completed: rows.filter((x) => x.status === 'completed'),
    };
  }

  async getStoreAnalytics(): Promise<unknown> {
    const [inventory, reserves] = await Promise.all([
      this.prisma.inventoryItem.findMany({
        include: {
          images: true,
        },
      }),
      this.prisma.reserveRequest.findMany(),
    ]);

    const available = inventory.filter((x) => x.quantity > 0);
    const withImages = inventory.filter((x) => x.images.length > 0);
    const withoutImages = inventory.filter((x) => x.images.length === 0);

    const avgPrice =
      available.length > 0
        ? available.reduce(
            (sum, x) =>
              sum + Number(x.expectedSalePriceManual ?? x.totalCost ?? 0),
            0,
          ) / available.length
        : 0;

    const visibleInventoryValue = available.reduce(
      (sum, x) => sum + Number(x.expectedSalePriceManual ?? x.totalCost ?? 0),
      0,
    );

    return {
      totalInventory: inventory.length,
      availableInventory: available.length,
      soldOutInventory: inventory.length - available.length,
      inventoryWithImages: withImages.length,
      inventoryWithoutImages: withoutImages.length,
      reserveRequests: reserves.length,
      pendingReserves: reserves.filter((x) => x.status === 'pending').length,
      approvedReserves: reserves.filter((x) => x.status === 'approved').length,
      contactedReserves: reserves.filter((x) => x.status === 'contacted').length,
      rejectedReserves: reserves.filter((x) => x.status === 'rejected').length,
      avgVisiblePrice: Number(avgPrice.toFixed(2)),
      visibleInventoryValue: Number(visibleInventoryValue.toFixed(2)),
    };
  }
}