import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class PublicStoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
    private readonly redis: RedisService,
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

  async getCatalog(params: { q?: string; type?: string; availableOnly?: boolean; theme?: string; sort?: string; limit?: number; seller?: string }): Promise<unknown[]> {
    const cacheKey = `public_catalog_store:${JSON.stringify(params)}`;
    
    if (!params.q) {
      const cached = await this.redis.get<unknown[]>(cacheKey);
      if (cached) return cached;
    }

    const limit = Math.min(params.limit ?? 48, 200);
    const q = params.q?.trim();

    const data = await this.prisma.inventoryItem.findMany({
      where: {
        quantity: params.availableOnly === true ? { gt: 0 } : undefined,
        OR: [
          { isMarketplace: false },
          { isMarketplace: true, approvalStatus: 'approved' }
        ],
        ...(params.seller === 'community' ? { isMarketplace: true } : params.seller === 'arcturus' ? { isMarketplace: false } : {}),
        ...(params.type && params.type !== 'all' ? { item: { kind: params.type } } : {}),
        ...(params.theme ? { item: { theme: { equals: params.theme, mode: 'insensitive' } } } : {}),
        ...(q ? { OR: [
          { titleSnapshot: { contains: q, mode: 'insensitive' } }, 
          { item: { title: { contains: q, mode: 'insensitive' } } }, 
          { item: { setNumber: { contains: q, mode: 'insensitive' } } }, 
          { item: { theme: { contains: q, mode: 'insensitive' } } }
        ] } : {}),
      },
      select: {
        id: true,
        titleSnapshot: true,
        expectedSalePriceManual: true,
        totalCost: true,
        quantity: true,
        condition: true,
        sealed: true,
        item: { select: { title: true, theme: true, setNumber: true, kind: true } },
        images: { where: { isPrimary: true }, take: 1, select: { imageUrl: true } },
      },
      orderBy: this.resolveOrderBy(params.sort),
      take: limit,
    });

    if (!params.q) {
      await this.redis.set(cacheKey, data, 300);
    }

    return data;
  }

  async getCatalogItemBySlug(slug: string): Promise<unknown | null> {
    const normalized = slug.trim().toLowerCase();

    const all = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 }, OR: [{ isMarketplace: false }, { isMarketplace: true, approvalStatus: 'approved' }] },
      include: {
        item: true,
        images: { orderBy: { sortOrder: 'asc' } },
        assignedUser: true,
        seller: { select: { id: true, name: true } }, 
      },
      take: 500,
    });

    const exactIdMatch = all.find(entry => normalized === entry.id.toLowerCase());
    if (exactIdMatch) return exactIdMatch;

    const suffixMatch = all.find(entry => normalized.endsWith(`-${entry.id.slice(-6).toLowerCase()}`));
    if (suffixMatch) return suffixMatch;

    const slugMatch = all.find((entry) => {
      const title = entry.titleSnapshot || entry.item?.title || entry.id;
      const generated = this.slugify(title);
      return generated === normalized || entry.id.toLowerCase() === normalized;
    });

    return slugMatch ?? null;
  }

  async trackOrder(query: string): Promise<unknown> {
    const normalized = query.trim();
    if (!normalized) throw new BadRequestException('Tracking query is required');

    const order = await this.prisma.order.findFirst({
      where: {
        OR: [
          { id: normalized },
          { contact: { contains: normalized } }
        ]
      },
      select: {
        id: true,
        status: true,
        productTitle: true,
        sellPrice: true,
        quantity: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async createReserve(params: { inventoryItemId?: string | null; productTitle?: string; name: string; contact: string; message?: string | null }): Promise<unknown> {
    const name = params.name.trim();
    const contact = params.contact.trim();
    const message = params.message?.trim() ?? '';
    let productTitle = params.productTitle?.trim() ?? '';
    let inventoryItemId = params.inventoryItemId;

    if (inventoryItemId) {
      const inventoryItem = await this.prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
        select: { titleSnapshot: true, id: true, expectedSalePriceManual: true, quantity: true, item: { select: { title: true } } },
      });
      if (!inventoryItem) throw new NotFoundException('Inventory item not found');
      if (inventoryItem.quantity < 1) throw new BadRequestException('Item is out of stock');
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

      if (inventoryItemId) {
        await tx.inventoryItem.update({
          where: { id: inventoryItemId },
          data: { quantity: { decrement: 1 } }
        });
      }

      return { reserve, order };
    });

    await this.activity.log('reserve.created', { reserveRequestId: result.reserve.id, orderId: result.order.id, inventoryItemId: result.reserve.inventoryItemId, productTitle: result.reserve.productTitle, name: result.reserve.name, contact: result.reserve.contact });
    
    await this.notifications.createReserveNotification({ 
      reserveId: result.reserve.id,
      productTitle: result.reserve.productTitle,
      customerName: result.reserve.name,
      contact: result.reserve.contact
    });

    this.realtime.emitCustom('reserve.created', result.reserve);
    this.realtime.emitCustom('order.created', result.order);
    this.realtime.emitDashboardRefresh('reserve_created');
    
    if (inventoryItemId) {
      this.realtime.emitInventoryRefresh({ inventoryItemId, reason: 'reserve_created_stock_deducted' });
    }

    return { ...result.reserve, orderId: result.order.id };
  }

  async getReserveRequests(params?: { q?: string; status?: string }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.reserveRequest.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(q ? { OR: [
          { productTitle: { contains: q, mode: 'insensitive' } },
          { name: { contains: q, mode: 'insensitive' } },
          { contact: { contains: q, mode: 'insensitive' } },
          { message: { contains: q, mode: 'insensitive' } },
        ] } : {}),
      },
      include: { orders: true, inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });
  }

  async getReserveRequest(id: string): Promise<unknown> {
    const row = await this.prisma.reserveRequest.findUnique({
      where: { id },
      include: { orders: true, inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' } } } } },
    });
    if (!row) throw new NotFoundException('Reserve request not found');
    return row;
  }

  async updateReserveRequest(body: { id: string; status?: string; adminNote?: string | null }): Promise<unknown> {
    if (!body.id) throw new BadRequestException('Reserve request id is required');

    const existing = await this.prisma.reserveRequest.findUnique({ where: { id: body.id }, include: { orders: true } });
    if (!existing) throw new NotFoundException('Reserve request not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const reserve = await tx.reserveRequest.update({ where: { id: body.id }, data: { status: body.status, adminNote: body.adminNote } });
      
      if (body.status && existing.orders.length > 0) {
        await tx.order.updateMany({
          where: { reserveRequestId: body.id },
          data: { status: body.status === 'approved' ? 'approved' : body.status === 'contacted' ? 'contacted' : body.status === 'rejected' ? 'cancelled' : body.status, adminNote: body.adminNote },
        });
      }

      if (body.status === 'rejected' && existing.status !== 'rejected') {
        if (existing.inventoryItemId) {
          await tx.inventoryItem.update({
            where: { id: existing.inventoryItemId },
            data: { quantity: { increment: 1 } }
          });
        }
      }

      return reserve;
    });

    await this.activity.log('reserve.updated', { reserveRequestId: updated.id, status: updated.status, adminNote: updated.adminNote });
    
    this.realtime.emitCustom('reserve.updated', updated);
    this.realtime.emitDashboardRefresh('reserve_updated');

    if (existing.inventoryItemId && body.status === 'rejected') {
      this.realtime.emitInventoryRefresh({ inventoryItemId: existing.inventoryItemId, reason: 'reserve_rejected_restock' });
    }

    return updated;
  }

  async getReserveBoard(): Promise<unknown> {
    const rows = await this.prisma.reserveRequest.findMany({
      include: { orders: true, inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' }, take: 1 } } } },
      orderBy: { createdAt: 'desc' },
      take: 500,
    });

    return {
      pending: rows.filter((x) => x.status === 'pending'),
      approved: rows.filter((x) => x.status === 'approved'),
      contacted: rows.filter((x) => x.status === 'contacted'),
      rejected: rows.filter((x) => x.status === 'rejected'),
      completed: rows.filter((x) => x.status === 'completed' || x.status === 'sold'),
    };
  }

  async getStoreAnalytics(): Promise<unknown> {
    const [inventory, reserves] = await Promise.all([
      this.prisma.inventoryItem.findMany({ include: { images: true } }),
      this.prisma.reserveRequest.findMany(),
    ]);

    const available = inventory.filter((x) => x.quantity > 0);
    const withImages = inventory.filter((x) => x.images.length > 0);
    const withoutImages = inventory.filter((x) => x.images.length === 0);

    const avgPrice = available.length > 0
        ? available.reduce((sum, x) => sum + Number(x.expectedSalePriceManual ?? x.totalCost ?? 0), 0) / available.length
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