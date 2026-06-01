import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { SalesService } from '../sales/sales.service';
import { NovaPoshtaService } from '../shipping/nova-poshta.service';
import { TelegramService } from '../notifications/telegram.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
    private readonly salesService: SalesService,
    private readonly novaPoshta: NovaPoshtaService,
    private readonly telegram: TelegramService,
  ) {}

  async list(params?: { status?: string; q?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();
    const orders = await this.prisma.order.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(q
          ? {
              OR: [
                { productTitle: { contains: q, mode: 'insensitive' } },
                { buyerName: { contains: q, mode: 'insensitive' } },
                { contact: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        reserveRequest: true,
        inventoryItem: {
          include: {
            item: true,
            images: { orderBy: { sortOrder: 'asc' } },
          },
        },
        sale: true,
      },
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 200,
    });

    const phones = orders.map(o => o.contact.replace(/[^\d+]/g, ''));
    const clients = await this.prisma.clientProfile.findMany({
      where: { phone: { in: phones } }
    });
    
    return orders.map(o => {
      const p = o.contact.replace(/[^\d+]/g, '');
      const c = clients.find(cl => cl.phone === p);
      return { ...o, clientProfile: c || null };
    });
  }

  async getById(id: string): Promise<unknown> {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: {
        reserveRequest: true,
        inventoryItem: {
          include: {
            item: true,
            images: { orderBy: { sortOrder: 'asc' } },
            location: { include: { warehouse: true } },
          },
        },
        sale: true,
      },
    });
    if (!order) throw new NotFoundException('Order not found');

    const phoneStr = order.contact.replace(/[^\d+]/g, '');
    const clientProfile = await this.prisma.clientProfile.findUnique({ where: { phone: phoneStr } });

    return { ...order, clientProfile };
  }

  async generateBulkTTN(ordersData: { orderId: string, weight: number }[]): Promise<unknown> {
    if (!ordersData || ordersData.length === 0) throw new BadRequestException('No orders provided');

    const orderIds = ordersData.map(o => o.orderId);
    const weightMap = new Map(ordersData.map(o => [o.orderId, o.weight]));

    const orders = await this.prisma.order.findMany({
      where: { id: { in: orderIds }, status: { in: ['pending', 'approved', 'contacted', 'paid'] } },
    });

    if (orders.length === 0) throw new BadRequestException('No valid orders found for TTN generation');

    const results = [];
    let successCount = 0;

    for (const order of orders) {
      if (order.adminNote?.includes('TTN:')) {
        results.push({ orderId: order.id, status: 'skipped', reason: 'Already has TTN' });
        continue;
      }

      try {
        const parts = order.buyerName.split(' ');
        
        let cleanPhone = order.contact.replace(/[^\d]/g, '');
        if (cleanPhone.startsWith('0')) cleanPhone = '38' + cleanPhone;
        if (cleanPhone.length > 12) cleanPhone = cleanPhone.slice(0, 12);

        const isPaid = order.status === 'paid' || order.channel === 'paid_upfront';
        const weight = weightMap.get(order.id) || 2.5; 

        const ttn = await this.novaPoshta.createExpressWaybill({
          orderId: order.id,
          firstName: parts[0] || 'Клієнт',
          lastName: parts.slice(1).join(' ') || 'Покупець',
          phone: cleanPhone,
          deliveryString: order.adminNote || '', 
          weight,
          cost: order.sellPrice ?? 2000,
          isPaid 
        });

        const updatedAdminNote = `${order.adminNote ?? ''} [TTN: ${ttn}]`.trim();

        await this.prisma.order.update({
          where: { id: order.id },
          data: { 
            adminNote: updatedAdminNote, 
            status: isPaid ? 'sold' : 'contacted',
            deliveryStatus: 'Створено' 
          }
        });

        results.push({ orderId: order.id, status: 'success', ttn });
        successCount++;
      } catch (err: any) {
        results.push({ orderId: order.id, status: 'failed', reason: err.message });
      }
    }

    await this.activity.log('orders.bulk_ttn_generated', { attempted: orders.length, success: successCount });
    this.realtime.emitDashboardRefresh('bulk_ttn');

    return { processed: orders.length, success: successCount, results };
  }

  async getBulkPdf(orderIds: string[]): Promise<{ url: string }> {
    const orders = await this.prisma.order.findMany({
      where: { id: { in: orderIds } }
    });

    const ttns: string[] = [];
    for (const order of orders) {
      const match = order.adminNote?.match(/\[TTN:\s*(\d+)\]/);
      if (match && match[1]) ttns.push(match[1]);
    }

    if (ttns.length === 0) throw new BadRequestException('No TTNs found for selected orders');
    
    const url = await this.novaPoshta.getBulkPdfLink(ttns);
    return { url };
  }

  async create(dto: CreateOrderDto & { promoCode?: string }): Promise<unknown> {
    if (!dto.productTitle?.trim() || !dto.buyerName?.trim() || !dto.contact?.trim()) {
      throw new BadRequestException('productTitle, buyerName, and contact are required');
    }

    let finalPrice = dto.sellPrice != null ? toMoney(dto.sellPrice) : null;
    let appliedPromoId = null;

    if (dto.promoCode && finalPrice) {
      const promo = await this.prisma.promoCode.findUnique({ where: { code: dto.promoCode } });
      if (promo && !promo.isUsed && (!promo.validUntil || promo.validUntil > new Date())) {
        finalPrice = toMoney(finalPrice * (1 - promo.discountPercent / 100));
        appliedPromoId = promo.id;
      }
    }

    if (dto.inventoryItemId) {
      const inventory = await this.prisma.inventoryItem.findUnique({ where: { id: dto.inventoryItemId } });
      if (!inventory) throw new NotFoundException('Inventory item not found');
    }

    const phoneStr = dto.contact.replace(/[^\d+]/g, '');
    const clientProfile = await this.prisma.clientProfile.findUnique({ where: { phone: phoneStr } });

    if (clientProfile && clientProfile.status === 'blacklisted' && dto.channel !== 'paid_upfront') {
      throw new BadRequestException('Client is blacklisted due to unfulfilled COD orders. 100% upfront payment required.');
    }

    const created = await this.prisma.$transaction(async (tx) => {
      if (appliedPromoId) {
        await tx.promoCode.update({ where: { id: appliedPromoId }, data: { isUsed: true } });
      }

      return tx.order.create({
        data: {
          reserveRequestId: dto.reserveRequestId ?? null,
          inventoryItemId: dto.inventoryItemId ?? null,
          productTitle: dto.productTitle.trim(),
          buyerName: dto.buyerName.trim(),
          contact: dto.contact.trim(),
          sellPrice: finalPrice,
          quantity: dto.quantity ?? 1,
          channel: dto.channel ?? null,
          adminNote: dto.adminNote ?? null,
          status: 'pending',
        },
        include: { reserveRequest: true, inventoryItem: true },
      });
    });

    await this.activity.log('order.created', { orderId: created.id });
    
    await this.telegram.sendOrderAlert({
      id: created.id,
      title: created.productTitle,
      price: created.sellPrice || 0,
      client: created.buyerName,
      phone: created.contact,
      note: created.adminNote || 'Без коментарів'
    });

    this.realtime.emitCustom('order.created', created);
    this.realtime.emitDashboardRefresh('order_created');

    return created;
  }

  async createFromReserve(reserveRequestId: string): Promise<unknown> {
    const reserve = await this.prisma.reserveRequest.findUnique({
      where: { id: reserveRequestId },
      include: { inventoryItem: true },
    });
    if (!reserve) throw new NotFoundException('Reserve request not found');

    const existing = await this.prisma.order.findFirst({ where: { reserveRequestId } });
    if (existing) return this.getById(existing.id);

    return this.create({
      reserveRequestId: reserve.id,
      inventoryItemId: reserve.inventoryItemId ?? null,
      productTitle: reserve.productTitle,
      buyerName: reserve.name,
      contact: reserve.contact,
      sellPrice: reserve.inventoryItem?.expectedSalePriceManual ?? null,
      quantity: 1,
      channel: 'reserve',
      adminNote: reserve.message ?? null,
    });
  }

  async update(dto: UpdateOrderDto): Promise<unknown> {
    const existing = await this.prisma.order.findFirst({ where: { id: dto.id } });
    if (!existing) throw new NotFoundException('Order not found');

    const updated = await this.prisma.$transaction(async (tx) => {
      const upd = await tx.order.update({
        where: { id: dto.id },
        data: {
          status: dto.status,
          productTitle: dto.productTitle,
          buyerName: dto.buyerName,
          contact: dto.contact,
          sellPrice: dto.sellPrice === undefined ? undefined : dto.sellPrice === null ? null : toMoney(dto.sellPrice),
          quantity: dto.quantity,
          channel: dto.channel,
          adminNote: dto.adminNote,
        },
        include: { reserveRequest: true, inventoryItem: true, sale: true },
      });

      if (dto.status === 'cancelled' && existing.status !== 'cancelled') {
        const wasDeductedBefore = existing.reserveRequestId != null || existing.channel === 'public_store';
        if (existing.inventoryItemId && wasDeductedBefore) {
          await tx.inventoryItem.update({
            where: { id: existing.inventoryItemId },
            data: { quantity: { increment: existing.quantity } }
          });
        }
      }
      return upd;
    });

    this.realtime.emitCustom('order.updated', updated);
    this.realtime.emitDashboardRefresh('order_updated');
    return updated;
  }

  async updateStatus(id: string, status: string): Promise<unknown> {
    return this.update({ id, status });
  }

  async completeAsSale(id: string): Promise<unknown> {
    const order = await this.prisma.order.findFirst({
      where: { id },
      include: { inventoryItem: true, sale: true },
    });

    if (!order) throw new NotFoundException('Order not found');
    if (order.saleId) return this.getById(order.id);
    if (!order.inventoryItemId && !order.isDropship) throw new BadRequestException('Order has no inventory item');
    if (!order.sellPrice || order.sellPrice <= 0) throw new BadRequestException('Order has no valid sell price');

    const isPublicStoreOrder = order.reserveRequestId != null || order.channel === 'public_store';

    let saleId;

    if (order.isDropship && order.supplierCost) {
       const profit = order.sellPrice - order.supplierCost;
       const roi = (profit / order.supplierCost) * 100;
       
       const sale = await this.prisma.sale.create({
         data: {
           inventoryItemId: 'dropship_item_placeholder', // Dummy or create a specific dropship ghost item
           itemId: order.inventoryItem?.itemId ?? 'unknown_item_id',
           quantity: order.quantity,
           sellPrice: order.sellPrice,
           costBasis: order.supplierCost,
           profit: profit,
           roiPercent: roi,
           channel: 'dropship',
           buyerName: order.buyerName,
           notes: `Zero-touch dropship from listing ${order.sourceListingId}`,
         }
       });
       saleId = sale.id;
    } else if (order.inventoryItemId) {
      const sale = await this.salesService.registerSale({
        inventoryItemId: order.inventoryItemId,
        sellPrice: order.sellPrice,
        quantity: order.quantity,
        channel: order.channel ?? 'order',
        buyerName: order.buyerName,
        notes: order.adminNote ?? null,
        skipStockDeduction: isPublicStoreOrder, 
      });
      saleId = (sale as any).id;
    }

    const updated = await this.prisma.order.update({
      where: { id },
      data: { status: 'sold', saleId },
    });

    this.realtime.emitCustom('order.sold', updated);
    this.realtime.emitDashboardRefresh('order_sold');
    return updated;
  }

  async approveDropship(dto: { reserveRequestId: string, listingId: string, supplierCost: number }) {
    const reserve = await this.prisma.reserveRequest.findUnique({ where: { id: dto.reserveRequestId } });
    if (!reserve) throw new NotFoundException('Reserve not found');

    const listing = await this.prisma.marketListing.findUnique({ where: { id: dto.listingId }});
    if (!listing) throw new NotFoundException('Listing not found');

    let order = await this.prisma.order.findFirst({ where: { reserveRequestId: dto.reserveRequestId }});

    const sellPrice = order?.sellPrice ?? toMoney(dto.supplierCost * 1.35); 

    const result = await this.prisma.$transaction(async (tx) => {
        if (!order) {
            order = await tx.order.create({
                data: {
                    reserveRequestId: reserve.id,
                    productTitle: reserve.productTitle,
                    buyerName: reserve.name,
                    contact: reserve.contact,
                    status: 'approved',
                    sellPrice: sellPrice,
                    quantity: 1,
                    channel: 'dropship',
                    isDropship: true,
                    sourceListingId: listing.id,
                    supplierCost: dto.supplierCost,
                    adminNote: reserve.message
                }
            });
        } else {
            order = await tx.order.update({
                where: { id: order.id },
                data: {
                    status: 'approved',
                    isDropship: true,
                    sourceListingId: listing.id,
                    supplierCost: dto.supplierCost,
                }
            });
        }

        await tx.reserveRequest.update({
            where: { id: reserve.id },
            data: { status: 'approved', adminNote: `Approved for dropship via listing ${listing.id}` }
        });

        await tx.purchaseOrder.create({
            data: {
                itemId: listing.itemId,
                titleSnapshot: listing.title,
                sourceCode: listing.sourceCode,
                sourceUrl: listing.url,
                status: 'planned',
                plannedPrice: dto.supplierCost,
                targetSellPrice: order.sellPrice,
                quantity: 1,
                notes: `DROPSHIP for order ${order.id}. Ship directly to client: ${order.buyerName}, ${order.contact}, ${order.adminNote}`
            }
        });

        await tx.decisionSnapshot.updateMany({
            where: { contextType: 'zero_touch', contextId: reserve.id },
            data: { executionStatus: 'executed' }
        });

        return order;
    });

    this.realtime.emitDashboardRefresh('dropship_approved');
    return result;
  }

  async board(): Promise<any> {
    const orders = await this.prisma.order.findMany({
      include: {
        inventoryItem: { include: { item: true, images: { orderBy: { sortOrder: 'asc' } } } },
        reserveRequest: true,
        sale: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 300,
    });

    const phones = orders.map(o => o.contact.replace(/[^\d+]/g, ''));
    const clients = await this.prisma.clientProfile.findMany({
      where: { phone: { in: phones } }
    });
    
    const enriched = orders.map(o => {
      const p = o.contact.replace(/[^\d+]/g, '');
      const c = clients.find(cl => cl.phone === p);
      return { ...o, clientProfile: c || null };
    });

    return {
      pending: enriched.filter((order) => order.status === 'pending'),
      approved: enriched.filter((order) => order.status === 'approved'),
      contacted: enriched.filter((order) => order.status === 'contacted'),
      sold: enriched.filter((order) => order.status === 'sold'),
      cancelled: enriched.filter((order) => order.status === 'cancelled'),
    };
  }

  async stats(): Promise<unknown> {
    const agg = await this.prisma.order.groupBy({
      by: ['status'],
      _count: true,
      _sum: { sellPrice: true }
    });

    const getCount = (status: string) => agg.find(a => a.status === status)?._count ?? 0;
    
    return {
      total: agg.reduce((sum, a) => sum + a._count, 0),
      pending: getCount('pending'),
      approved: getCount('approved'),
      contacted: getCount('contacted'),
      sold: getCount('sold'),
      cancelled: getCount('cancelled'),
      pipelineValue: agg
        .filter((a) => !['sold', 'cancelled'].includes(a.status))
        .reduce((sum, a) => sum + Number(a._sum.sellPrice ?? 0), 0),
    };
  }
}