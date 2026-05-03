import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]+/gu, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  private resolveOrderBy(sort?: string): any {
    if (sort === 'price_asc') return { expectedSalePriceManual: 'asc' };
    if (sort === 'price_desc') return { expectedSalePriceManual: 'desc' };
    if (sort === 'title_asc') return { titleSnapshot: 'asc' };
    if (sort === 'title_desc') return { titleSnapshot: 'desc' };
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
        ...(params.type && params.type !== 'all' ? { item: { kind: params.type } } : {}),
        ...(params.theme ? { item: { theme: { equals: params.theme, mode: 'insensitive' } } } : {}),
        ...(q
          ? {
              OR: [
                { titleSnapshot: { contains: q, mode: 'insensitive' } },
                { item: { title: { contains: q, mode: 'insensitive' } } },
                { item: { setNumber: { contains: q, mode: 'insensitive' } } },
                { item: { theme: { contains: q, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        titleSnapshot: true,
        expectedSalePriceManual: true,
        totalCost: true,
        quantity: true,
        condition: true,
        item: { select: { title: true, theme: true, setNumber: true, kind: true } },
        images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } },
      },
      orderBy: this.resolveOrderBy(params.sort),
      take: limit,
    });
  }

  async getCatalogItem(slug: string): Promise<unknown | null> {
    const normalized = slug.trim().toLowerCase();

    const entry = await this.prisma.inventoryItem.findFirst({
      where: {
        OR: [
          { id: normalized },
          { titleSnapshot: { equals: normalized.replace(/-/g, ' '), mode: 'insensitive' } }
        ],
        quantity: { gt: 0 }
      },
      include: {
        item: true,
        location: { include: { warehouse: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        assignedUser: { select: { id: true, name: true } },
      }
    });

    if (!entry) throw new NotFoundException('Product not found');

    const related = await this.prisma.inventoryItem.findMany({
      where: {
        id: { not: entry.id },
        quantity: { gt: 0 },
        item: { theme: entry.item?.theme ?? undefined },
      },
      select: {
        id: true,
        titleSnapshot: true,
        expectedSalePriceManual: true,
        totalCost: true,
        quantity: true,
        condition: true,
        item: { select: { title: true } },
        images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 8,
    });

    return {
      ...entry,
      slug: this.slugify(entry.titleSnapshot || entry.item?.title || entry.id),
      related,
    };
  }

  async getRelatedCatalogItems(params: { slug: string; limit?: number }): Promise<unknown[]> {
    const item = (await this.getCatalogItem(params.slug)) as any | null;
    if (!item) return [];

    const theme = item.item?.theme ?? null;
    const kind = item.item?.kind ?? null;

    return this.prisma.inventoryItem.findMany({
      where: {
        id: { not: item.id },
        quantity: { gt: 0 },
        item: { ...(theme ? { theme } : {}), ...(kind ? { kind } : {}) },
      },
      select: {
        id: true,
        titleSnapshot: true,
        expectedSalePriceManual: true,
        totalCost: true,
        quantity: true,
        condition: true,
        item: { select: { title: true } },
        images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: Math.min(params.limit ?? 8, 24),
    });
  }

  async createReserve(params: { inventoryItemId?: string | null; productTitle: string; name: string; contact: string; message?: string | null }): Promise<unknown> {
    const name = params.name.trim();
    const contact = params.contact.trim();
    const message = params.message?.trim() ?? '';
    let productTitle = params.productTitle?.trim() ?? '';
    let inventoryItemId = params.inventoryItemId;

    if (inventoryItemId) {
      const inventoryItem = await this.prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
        select: { titleSnapshot: true, id: true, expectedSalePriceManual: true, item: { select: { title: true } } },
      });

      if (!inventoryItem) throw new NotFoundException('Inventory item not found');
      productTitle = productTitle || inventoryItem.titleSnapshot || inventoryItem.item?.title || inventoryItem.id;
    }

    if (!productTitle) throw new BadRequestException('Product title is required');

    const result = await this.prisma.$transaction(async (tx) => {
      const reserve = await tx.reserveRequest.create({
        data: { inventoryItemId, productTitle, name, contact, message, status: 'pending' },
      });

      const order = await tx.order.create({
        data: {
          reserveRequestId: reserve.id,
          inventoryItemId: reserve.inventoryItemId,
          productTitle: reserve.productTitle,
          buyerName: reserve.name,
          contact: reserve.contact,
          status: 'pending',
          sellPrice: null, 
          quantity: 1,
          channel: 'public_store',
          adminNote: reserve.message ?? null,
        },
      });

      return { reserve, order };
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
      payloadJson: { reserveRequestId: result.reserve.id, orderId: result.order.id },
    });

    this.realtime.emitCustom('reserve.created', result.reserve);
    this.realtime.emitCustom('order.created', result.order);
    this.realtime.emitDashboardRefresh('reserve_created');

    return result.reserve;
  }

  async listReserveRequests(params?: { q?: string; status?: string }): Promise<unknown[]> {
    const q = params?.q?.trim();
    return this.prisma.reserveRequest.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(q
          ? {
              OR: [
                { productTitle: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
                { contact: { contains: q, mode: 'insensitive' } },
                { message: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        orders: true,
        inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async getReserveRequest(id: string): Promise<unknown> {
    const row = await this.prisma.reserveRequest.findUnique({
      where: { id },
      include: {
        orders: true,
        inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' } } } },
      },
    });

    if (!row) throw new NotFoundException('Reserve request not found');
    return row;
  }

  async updateReserveRequest(params: { id: string; status?: string; adminNote?: string | null }): Promise<unknown> {
    if (!params.id) throw new BadRequestException('Reserve request id is required');

    const existing = await this.prisma.reserveRequest.findUnique({
      where: { id: params.id },
      include: { orders: true },
    });

    if (!existing) throw new NotFoundException('Reserve request not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const reserve = await tx.reserveRequest.update({
        where: { id: params.id },
        data: { status: params.status, adminNote: params.adminNote },
      });

      if (params.status && existing.orders.length > 0) {
        await tx.order.updateMany({
          where: { reserveRequestId: params.id },
          data: {
            status: params.status === 'approved' ? 'approved' : params.status === 'contacted' ? 'contacted' : params.status === 'rejected' ? 'cancelled' : params.status,
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

  async reserveBoard(): Promise<any> {
    const rows = await this.prisma.reserveRequest.findMany({
      include: {
        orders: true,
        inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } } },
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });

    return {
      pending: rows.filter((x) => x.status === 'pending'),
      approved: rows.filter((x) => x.status === 'approved'),
      contacted: rows.filter((x) => x.status === 'contacted'),
      rejected: rows.filter((x) => x.status === 'rejected'),
      sold: rows.filter((x) => x.status === 'sold'),
    };
  }

  async analytics(): Promise<unknown> {
    const [inventoryAgg, reservesCount, pendingReserves, salesAgg, ordersAgg] = await Promise.all([
      this.prisma.inventoryItem.aggregate({
        _count: true,
        _sum: { quantity: true, expectedSalePriceManual: true, totalCost: true },
        where: { quantity: { gt: 0 } }
      }),
      this.prisma.reserveRequest.count(),
      this.prisma.reserveRequest.count({ where: { status: 'pending' } }),
      this.prisma.sale.aggregate({ _count: true, _sum: { profit: true } }),
      this.prisma.order.aggregate({ _count: true })
    ]);

    return {
      totalInventory: inventoryAgg._count,
      availableInventory: inventoryAgg._sum.quantity ?? 0,
      reserveRequests: reservesCount,
      pendingReserves,
      salesCount: salesAgg._count,
      totalSalesProfit: toMoney(salesAgg._sum.profit ?? 0),
      orders: ordersAgg._count,
      visibleInventoryValue: toMoney(inventoryAgg._sum.expectedSalePriceManual ?? inventoryAgg._sum.totalCost ?? 0),
    };
  }
}