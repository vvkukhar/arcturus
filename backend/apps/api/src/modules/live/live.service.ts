import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class LiveService {
  private readonly logger = new Logger(LiveService.name);
  private activeAuctionTimers = new Map<string, NodeJS.Timeout>();

  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway
  ) {}

  async getActiveStream() {
    return this.prisma.liveStream.findFirst({
      where: { status: 'live' },
      include: {
        auctions: {
          where: { status: 'active' },
          include: { inventoryItem: { include: { item: true, images: { take: 1 } } } }
        }
      }
    });
  }

  async startStream(title: string, videoUrl?: string) {
    const stream = await this.prisma.liveStream.create({
      data: { title, videoUrl, status: 'live', startedAt: new Date() }
    });
    this.realtime.emitCustom('live.stream_started', stream);
    return stream;
  }

  async stopStream(streamId: string) {
    const stream = await this.prisma.liveStream.update({
      where: { id: streamId },
      data: { status: 'ended', endedAt: new Date() }
    });
    this.realtime.emitCustom('live.stream_ended', stream);
    return stream;
  }

  async startQuickAuction(streamId: string, inventoryItemId: string, startPrice: number) {
    const active = await this.prisma.liveAuction.findFirst({ where: { streamId, status: 'active' } });
    if (active) throw new BadRequestException('Another auction is already active');

    const endsAt = new Date(Date.now() + 60 * 1000); // 60 seconds

    const auction = await this.prisma.liveAuction.create({
      data: {
        streamId,
        inventoryItemId,
        startPrice,
        currentPrice: startPrice,
        status: 'active',
        startedAt: new Date(),
        endsAt,
      },
      include: { inventoryItem: { include: { item: true, images: { take: 1 } } } }
    });

    this.realtime.emitCustom('live.auction_started', auction);

    const timer = setTimeout(() => this.endAuction(auction.id), 60000);
    this.activeAuctionTimers.set(auction.id, timer);

    return auction;
  }

  async buyAuctionTicket(userId: string, auctionId: string) {
    const depositAmount = 500;

    const auction = await this.prisma.liveAuction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'active') throw new NotFoundException('Auction is not active');

    const existing = await this.prisma.auctionTicket.findUnique({
      where: { auctionId_userId: { auctionId, userId } }
    });

    if (existing) return existing;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.vaultBalance < depositAmount) {
      throw new BadRequestException('Insufficient Vault Balance to pay deposit (500 ₴ required).');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { vaultBalance: { decrement: depositAmount } }
      });

      await tx.vaultTransaction.create({
        data: { userId, amount: -depositAmount, type: 'auction_deposit', description: `Locked deposit for auction ${auctionId}` }
      });

      return tx.auctionTicket.create({
        data: { auctionId, userId, deposit: depositAmount, status: 'locked' }
      });
    });
  }

  async placeBid(userId: string, auctionId: string, amount: number) {
    const auction = await this.prisma.liveAuction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'active') throw new NotFoundException('Auction not active');
    
    if (amount <= auction.currentPrice) throw new BadRequestException('Bid too low');

    const ticket = await this.prisma.auctionTicket.findUnique({
      where: { auctionId_userId: { auctionId, userId } }
    });

    if (!ticket || ticket.status !== 'locked') {
      throw new BadRequestException('You must pay the deposit to bid.');
    }

    let newEndsAt = auction.endsAt!;
    const timeRemaining = newEndsAt.getTime() - Date.now();
    if (timeRemaining < 15000) {
      newEndsAt = new Date(Date.now() + 15000);
      if (this.activeAuctionTimers.has(auctionId)) {
        clearTimeout(this.activeAuctionTimers.get(auctionId));
      }
      const newTimer = setTimeout(() => this.endAuction(auctionId), 15000);
      this.activeAuctionTimers.set(auctionId, newTimer);
    }

    const updated = await this.prisma.$transaction(async (tx) => {
      await tx.liveBid.create({ data: { liveAuctionId: auctionId, userId, amount } });
      return tx.liveAuction.update({
        where: { id: auctionId },
        data: { currentPrice: amount, highestBidderId: userId, endsAt: newEndsAt },
        include: { inventoryItem: true }
      });
    });

    this.realtime.emitCustom('live.bid_placed', {
      auctionId,
      currentPrice: amount,
      endsAt: newEndsAt
    });

    return updated;
  }

  private async endAuction(auctionId: string) {
    this.activeAuctionTimers.delete(auctionId);
    
    const auction = await this.prisma.liveAuction.findUnique({
      where: { id: auctionId },
      include: { inventoryItem: true, tickets: true }
    });

    if (!auction || auction.status !== 'active') return;

    await this.prisma.$transaction(async (tx) => {
      await tx.liveAuction.update({
        where: { id: auctionId },
        data: { status: 'finished' }
      });

      if (auction.highestBidderId) {
        const winner = await tx.user.findUnique({ where: { id: auction.highestBidderId } });
        
        await tx.order.create({
          data: {
            inventoryItemId: auction.inventoryItemId,
            productTitle: auction.inventoryItem.titleSnapshot,
            buyerName: winner?.name || 'Live Winner',
            contact: winner?.phone || winner?.email || 'N/A',
            sellPrice: auction.currentPrice,
            channel: 'live_auction',
            status: 'pending'
          }
        });
        
        await tx.inventoryItem.update({
          where: { id: auction.inventoryItemId },
          data: { quantity: { decrement: 1 } }
        });

        // Форфейт депозиту для переможця (йде в рахунок оплати, або залишаємо як штраф)
        await tx.auctionTicket.update({
          where: { auctionId_userId: { auctionId, userId: auction.highestBidderId } },
          data: { status: 'forfeited' }
        });
      }

      // Повернення депозитів тим, хто не виграв
      for (const ticket of auction.tickets) {
        if (ticket.userId !== auction.highestBidderId && ticket.status === 'locked') {
          await tx.user.update({
            where: { id: ticket.userId },
            data: { vaultBalance: { increment: ticket.deposit } }
          });
          await tx.vaultTransaction.create({
            data: { userId: ticket.userId, amount: ticket.deposit, type: 'auction_refund', description: 'Auction deposit returned' }
          });
          await tx.auctionTicket.update({
            where: { id: ticket.id },
            data: { status: 'refunded' }
          });
        }
      }
    });

    this.realtime.emitCustom('live.auction_ended', { auctionId, winnerId: auction.highestBidderId });
  }
}