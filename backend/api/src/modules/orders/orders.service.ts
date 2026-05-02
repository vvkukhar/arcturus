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
import { SalesService } from '../sales/sales.service';
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
  ) {}

  async list(params?: {
    status?: string;
    q?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.order.findMany({
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
                  buyerName: {
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
        reserveRequest: true,
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
        sale: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.limit ?? 200,
    });
  }

  async getById(id: string): Promise<unknown> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        reserveRequest: true,
        inventoryItem: {
          include: {
            item: true,
            images: {
              orderBy: {
                sortOrder: 'asc',
              },
            },
            location: {
              include: {
                warehouse: true,
              },
            },
          },
        },
        sale: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async create(dto: CreateOrderDto): Promise<unknown> {
    if (!dto.productTitle?.trim()) {
      throw new BadRequestException('productTitle is required');
    }

    if (!dto.buyerName?.trim()) {
      throw new BadRequestException('buyerName is required');
    }

    if (!dto.contact?.trim()) {
      throw new BadRequestException('contact is required');
    }

    if (dto.inventoryItemId) {
      const inventory = await this.prisma.inventoryItem.findUnique({
        where: {
          id: dto.inventoryItemId,
        },
      });

      if (!inventory) {
        throw new NotFoundException('Inventory item not found');
      }
    }

    if (dto.reserveRequestId) {
      const reserve = await this.prisma.reserveRequest.findUnique({
        where: {
          id: dto.reserveRequestId,
        },
      });

      if (!reserve) {
        throw new NotFoundException('Reserve request not found');
      }
    }

    const created = await this.prisma.order.create({
      data: {
        reserveRequestId: dto.reserveRequestId ?? null,
        inventoryItemId: dto.inventoryItemId ?? null,
        productTitle: dto.productTitle.trim(),
        buyerName: dto.buyerName.trim(),
        contact: dto.contact.trim(),
        sellPrice: dto.sellPrice != null ? toMoney(dto.sellPrice) : null,
        quantity: dto.quantity ?? 1,
        channel: dto.channel ?? null,
        adminNote: dto.adminNote ?? null,
        status: 'pending',
      },
      include: {
        reserveRequest: true,
        inventoryItem: true,
      },
    });

    await this.activity.log('order.created', {
      orderId: created.id,
      reserveRequestId: created.reserveRequestId,
      inventoryItemId: created.inventoryItemId,
      productTitle: created.productTitle,
      buyerName: created.buyerName,
    });

    await this.notifications.create({
      title: 'New order',
      message: `${created.productTitle} • ${created.buyerName}`,
      type: 'order',
      payloadJson: {
        orderId: created.id,
      },
    });

    this.realtime.emitCustom('order.created', created);
    this.realtime.emitDashboardRefresh('order_created');

    return created;
  }

  async createFromReserve(reserveRequestId: string): Promise<unknown> {
    const reserve = await this.prisma.reserveRequest.findUnique({
      where: {
        id: reserveRequestId,
      },
      include: {
        inventoryItem: true,
      },
    });

    if (!reserve) {
      throw new NotFoundException('Reserve request not found');
    }

    const existing = await this.prisma.order.findFirst({
      where: {
        reserveRequestId,
      },
    });

    if (existing) {
      return this.getById(existing.id);
    }

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
    const existing = await this.prisma.order.findUnique({
      where: {
        id: dto.id,
      },
    });

    if (!existing) {
      throw new NotFoundException('Order not found');
    }

    const updated = await this.prisma.order.update({
      where: {
        id: dto.id,
      },
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
      include: {
        reserveRequest: true,
        inventoryItem: true,
        sale: true,
      },
    });

    await this.activity.log('order.updated', {
      orderId: updated.id,
      status: updated.status,
    });

    this.realtime.emitCustom('order.updated', updated);
    this.realtime.emitDashboardRefresh('order_updated');

    return updated;
  }

  async updateStatus(id: string, status: string): Promise<unknown> {
    return this.update({
      id,
      status,
    });
  }

  async completeAsSale(id: string): Promise<unknown> {
    const order = await this.prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        inventoryItem: true,
        sale: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.saleId) {
      return this.getById(order.id);
    }

    if (!order.inventoryItemId) {
      throw new BadRequestException('Order has no inventory item');
    }

    if (!order.sellPrice || order.sellPrice <= 0) {
      throw new BadRequestException('Order has no valid sell price');
    }

    const sale = await this.salesService.registerSale({
      inventoryItemId: order.inventoryItemId,
      sellPrice: order.sellPrice,
      quantity: order.quantity,
      channel: order.channel ?? 'order',
      buyerName: order.buyerName,
      notes: order.adminNote ?? null,
    });

    const saleId = (sale as any).id;

    const updated = await this.prisma.order.update({
      where: {
        id,
      },
      data: {
        status: 'sold',
        saleId,
      },
      include: {
        reserveRequest: true,
        inventoryItem: true,
        sale: true,
      },
    });

    if (order.reserveRequestId) {
      await this.prisma.reserveRequest.update({
        where: {
          id: order.reserveRequestId,
        },
        data: {
          status: 'sold',
        },
      });
    }

    await this.activity.log('order.completed_as_sale', {
      orderId: id,
      saleId,
    });

    this.realtime.emitCustom('order.sold', updated);
    this.realtime.emitDashboardRefresh('order_sold');

    return updated;
  }

  async board(): Promise<{
    pending: unknown[];
    approved: unknown[];
    contacted: unknown[];
    sold: unknown[];
    cancelled: unknown[];
  }> {
    const orders = await this.prisma.order.findMany({
      include: {
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
        reserveRequest: true,
        sale: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 300,
    });

    return {
      pending: orders.filter((order) => order.status === 'pending'),
      approved: orders.filter((order) => order.status === 'approved'),
      contacted: orders.filter((order) => order.status === 'contacted'),
      sold: orders.filter((order) => order.status === 'sold'),
      cancelled: orders.filter((order) => order.status === 'cancelled'),
    };
  }

  async stats(): Promise<unknown> {
    const orders = await this.prisma.order.findMany();

    return {
      total: orders.length,
      pending: orders.filter((order) => order.status === 'pending').length,
      approved: orders.filter((order) => order.status === 'approved').length,
      contacted: orders.filter((order) => order.status === 'contacted').length,
      sold: orders.filter((order) => order.status === 'sold').length,
      cancelled: orders.filter((order) => order.status === 'cancelled').length,
      pipelineValue: orders
        .filter((order) => !['sold', 'cancelled'].includes(order.status))
        .reduce((sum, order) => sum + Number(order.sellPrice ?? 0), 0),
    };
  }
}