import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class MonetizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway
  ) {}

  async buyBoost(sellerId: string, inventoryItemId: string, days: number) {
    const costPerDay = 150; 
    const totalCost = days * costPerDay;

    const inventory = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId }
    });

    if (!inventory || inventory.sellerId !== sellerId) {
      throw new NotFoundException('Listing not found or not owned by you');
    }

    const sellerSales = await this.prisma.sale.aggregate({
      where: { inventoryItem: { sellerId } },
      _sum: { sellerPayout: true }
    });
    
    const payouts = await this.prisma.payoutRequest.aggregate({
      where: { sellerId },
      _sum: { amount: true }
    });

    const balance = (sellerSales._sum.sellerPayout || 0) - (payouts._sum.amount || 0);

    if (balance < totalCost) {
      throw new BadRequestException('Insufficient funds in seller balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.payoutRequest.create({
        data: {
          sellerId,
          amount: totalCost,
          status: 'paid',
          adminNote: `System Deduction: Profile Boost for ${days} days`
        }
      });

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + days);

      const boost = await tx.promotedListing.upsert({
        where: { inventoryItemId },
        update: { expiresAt, cost: { increment: totalCost } },
        create: { inventoryItemId, sellerId, expiresAt, cost: totalCost }
      });

      this.realtime.emitDashboardRefresh('boost_purchased');
      return boost;
    });
  }

  async generateMysteryBoxes() {
    const staleLimit = new Date();
    staleLimit.setDate(staleLimit.getDate() - 60);

    const deadStock = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 }, isMarketplace: false, createdAt: { lt: staleLimit } },
      take: 10
    });

    if (deadStock.length < 3) return { generated: 0 };

    let generated = 0;
    for (let i = 0; i < deadStock.length; i += 3) {
      const chunk = deadStock.slice(i, i + 3);
      if (chunk.length < 3) break;

      const totalCost = chunk.reduce((sum, item) => sum + item.totalCost, 0);
      const retailValue = chunk.reduce((sum, item) => sum + (item.expectedSalePriceManual || item.totalCost * 1.5), 0);
      const boxPrice = totalCost * 1.8; 

      await this.prisma.mysteryBox.create({
        data: {
          title: 'Premium Collector Mystery Box',
          description: 'Contains 3 guaranteed authentic retired LEGO sets. Total value exceeds the price.',
          price: boxPrice,
          totalValue: retailValue,
          tier: boxPrice > 5000 ? 'diamond' : 'gold',
          items: { connect: chunk.map(c => ({ id: c.id })) }
        }
      });
      generated++;
    }

    return { generated };
  }

  async getAvailableMysteryBoxes() {
    return this.prisma.mysteryBox.findMany({
      where: { isSold: false },
      select: { id: true, title: true, description: true, price: true, tier: true }
    });
  }

  async purchaseMysteryBox(buyerId: string, boxId: string) {
    const box = await this.prisma.mysteryBox.findUnique({
      where: { id: boxId },
      include: { items: true }
    });

    if (!box || box.isSold) throw new BadRequestException('Box not available');

    return this.prisma.$transaction(async (tx) => {
      const updatedBox = await tx.mysteryBox.update({
        where: { id: boxId },
        data: { isSold: true, buyerId }
      });

      const order = await tx.order.create({
        data: {
          productTitle: box.title,
          buyerName: 'Mystery Box Buyer',
          contact: buyerId,
          sellPrice: box.price,
          status: 'pending',
          channel: 'mystery_box',
        }
      });

      for (const item of box.items) {
        await tx.inventoryItem.update({
          where: { id: item.id },
          data: { quantity: { decrement: 1 } }
        });
      }

      this.realtime.emitDashboardRefresh('mystery_box_sold');
      return { box: updatedBox, order };
    });
  }
}