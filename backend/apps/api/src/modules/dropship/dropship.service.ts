import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DropshipService {
  constructor(private readonly prisma: PrismaService) {}

  async getWholesaleCatalog() {
    const items = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 }, isMarketplace: false },
      include: { item: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } }
    });

    return items.map(i => {
      const retail = i.expectedSalePriceManual ?? (i.totalCost * 1.5);
      const b2bDiscount = 0.15; 
      const wholesalePrice = Math.round(retail * (1 - b2bDiscount));

      return {
        id: i.id,
        title: i.titleSnapshot,
        theme: i.item.theme,
        wholesalePrice,
        recommendedRetailPrice: retail,
        quantity: i.quantity,
        imageUrl: i.images[0]?.imageUrl
      };
    });
  }

  async createOrder(dropshipperId: string, payload: { inventoryItemId: string; customerName: string; contact: string; ttn?: string }) {
    const inventory = await this.prisma.inventoryItem.findUnique({ where: { id: payload.inventoryItemId } });
    if (!inventory || inventory.quantity < 1) throw new BadRequestException('Item unavailable');

    const retail = inventory.expectedSalePriceManual ?? (inventory.totalCost * 1.5);
    const wholesalePrice = Math.round(retail * 0.85);

    return this.prisma.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: inventory.id },
        data: { quantity: { decrement: 1 } }
      });

      const order = await tx.order.create({
        data: {
          inventoryItemId: inventory.id,
          productTitle: inventory.titleSnapshot,
          buyerName: payload.customerName,
          contact: payload.contact,
          sellPrice: wholesalePrice,
          channel: 'dropship_b2b',
          adminNote: `Dropshipper ID: ${dropshipperId}. TTN provided: ${payload.ttn || 'None'}`,
          status: 'pending'
        }
      });

      return order;
    });
  }
}