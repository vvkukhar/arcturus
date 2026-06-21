import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentsService } from '../payments/payments.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class DropshipService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly payments: PaymentsService,
    private readonly realtime: RealtimeGateway,
    private readonly redis: RedisService
  ) {}

  async getWholesaleCatalog() {
    const items = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 }, isMarketplace: false },
      include: { item: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' }
    });

    return items.map(i => {
      const retail = i.expectedSalePriceManual ?? (i.totalCost * 1.5);
      const b2bDiscount = 0.15; // 15% знижка для оптовиків
      const wholesalePrice = Math.round(retail * (1 - b2bDiscount));

      return {
        id: i.id,
        title: i.titleSnapshot,
        theme: i.item?.theme || 'LEGO',
        wholesalePrice,
        recommendedRetailPrice: retail,
        profitMargin: retail - wholesalePrice,
        quantity: i.quantity,
        imageUrl: i.images[0]?.imageUrl
      };
    });
  }

  async createOrder(
    dropshipperId: string, 
    payload: { inventoryItemId: string; customerName: string; contact: string; deliveryString: string; paymentMethod: 'vault' | 'card' }
  ) {
    const inventory = await this.prisma.inventoryItem.findUnique({ where: { id: payload.inventoryItemId } });
    if (!inventory || inventory.quantity < 1) throw new BadRequestException('Item unavailable');

    const retail = inventory.expectedSalePriceManual ?? (inventory.totalCost * 1.5);
    const wholesalePrice = Math.round(retail * 0.85);

    if (payload.paymentMethod === 'vault') {
      const user = await this.prisma.user.findUnique({ where: { id: dropshipperId } });
      if (!user || user.vaultBalance < wholesalePrice) {
        throw new BadRequestException('Insufficient funds in Vault balance');
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: inventory.id },
        data: { quantity: { decrement: 1 } }
      });

      if (payload.paymentMethod === 'vault') {
        await tx.user.update({
          where: { id: dropshipperId },
          data: { vaultBalance: { decrement: wholesalePrice } }
        });
        await tx.vaultTransaction.create({
          data: {
            userId: dropshipperId,
            amount: -wholesalePrice,
            type: 'payment',
            description: `B2B Dropship Order: ${inventory.titleSnapshot}`
          }
        });
      }

      const order = await tx.order.create({
        data: {
          inventoryItemId: inventory.id,
          productTitle: inventory.titleSnapshot,
          buyerName: payload.customerName,
          contact: payload.contact,
          sellPrice: wholesalePrice,
          channel: 'dropship_b2b',
          adminNote: `Dropship B2B Partner: ${dropshipperId} | Delivery: ${payload.deliveryString}`,
          status: payload.paymentMethod === 'vault' ? 'paid' : 'pending'
        }
      });

      return order;
    });

    // 🔥 ФІКС: Зкидаємо кеш каталогу та шлемо івенти на фронт
    await this.redis.delPattern('public_catalog*');
    this.realtime.emitDashboardRefresh('dropship_order_created');
    this.realtime.emitInventoryRefresh({ inventoryItemId: payload.inventoryItemId, reason: 'dropship_sale' });

    if (payload.paymentMethod === 'card') {
      const checkout = await this.payments.createCheckoutSession(result.id);
      return { order: result, url: checkout.url };
    }

    return { order: result };
  }
}