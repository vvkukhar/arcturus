import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { GamificationService } from '../gamification/gamification.service';

@Injectable()
export class AuctionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly gamification: GamificationService,
  ) {}

  async createAuction(sellerId: string, dto: { inventoryItemId: string; startPrice: number; durationMinutes: number }) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id: dto.inventoryItemId } });
    if (!item || item.sellerId !== sellerId) throw new BadRequestException('Товар не знайдено або не належить вам');

    const endsAt = new Date(Date.now() + dto.durationMinutes * 60 * 1000);

    return this.prisma.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: dto.inventoryItemId },
        data: { isAuction: true },
      });

      const auction = await tx.auction.create({
        data: {
          inventoryItemId: dto.inventoryItemId,
          sellerId,
          startPrice: dto.startPrice,
          currentPrice: dto.startPrice,
          endsAt,
        },
        include: { inventoryItem: true },
      });

      this.realtime.emitCustom('auction.created', auction);
      return auction;
    });
  }

  async placeBid(bidderId: string, auctionId: string, amount: number) {
    const auction = await this.prisma.auction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'active') throw new NotFoundException('Аукціон не активний');
    if (new Date() > auction.endsAt) throw new BadRequestException('Аукціон вже завершено');
    if (amount <= auction.currentPrice) throw new BadRequestException('Ставка має бути вищою за поточну ціну');

    let endsAt = new Date(auction.endsAt);
    const timeRemaining = endsAt.getTime() - Date.now();

    // Логіка Анти-снайпінгу (Anti-sniping): подовження на 15 секунд
    if (timeRemaining < 15000) {
      endsAt = new Date(Date.now() + 15000);
    }

    const updatedAuction = await this.prisma.$transaction(async (tx) => {
      await tx.bid.create({
        data: { auctionId, bidderId, amount },
      });

      return tx.auction.update({
        where: { id: auctionId },
        data: { currentPrice: amount, highestBidderId: bidderId, endsAt },
        include: { inventoryItem: true },
      });
    });

    this.realtime.emitCustom(`auction.${auctionId}.bid_placed`, {
      currentPrice: updatedAuction.currentPrice,
      highestBidderId: updatedAuction.highestBidderId,
      endsAt: updatedAuction.endsAt,
    });

    // Нараховуємо 5 Brick Points за проявлену активність (участь у торгах)
    await this.gamification.awardPoints(bidderId, 5, `Зроблено ставку на аукціоні #${auctionId}`);

    return updatedAuction;
  }

  async getActiveAuctions() {
    return this.prisma.auction.findMany({
      where: { status: 'active', endsAt: { gt: new Date() } },
      include: {
        inventoryItem: {
          include: {
            item: true,
            images: { orderBy: { sortOrder: 'asc' }, take: 1 }
          }
        },
        bids: {
          orderBy: { amount: 'desc' },
          take: 1
        }
      },
      orderBy: { endsAt: 'asc' }
    });
  }

  async getAuctionById(id: string) {
    const auction = await this.prisma.auction.findUnique({
      where: { id },
      include: {
        inventoryItem: {
          include: {
            item: true,
            images: { orderBy: { sortOrder: 'asc' } }
          }
        },
        bids: {
          include: { bidder: { select: { id: true, name: true } } },
          orderBy: { amount: 'desc' },
          take: 10
        }
      }
    });

    if (!auction) throw new NotFoundException('Auction not found');
    return auction;
  }
}