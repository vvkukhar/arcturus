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

    const endsAt = new Date(Date.now() + 30 * 1000); 

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

    const timer = setTimeout(() => this.endAuction(auction.id), 30000);
    this.activeAuctionTimers.set(auction.id, timer);

    return auction;
  }

  async placeBid(userId: string, auctionId: string, amount: number) {
    const auction = await this.prisma.liveAuction.findUnique({ where: { id: auctionId } });
    if (!auction || auction.status !== 'active') throw new NotFoundException('Auction not active');
    
    if (amount <= auction.currentPrice) throw new BadRequestException('Bid too low');

    let newEndsAt = auction.endsAt!;
    const timeRemaining = newEndsAt.getTime() - Date.now();
    if (timeRemaining < 10000) {
      newEndsAt = new Date(Date.now() + 10000);
      if (this.activeAuctionTimers.has(auctionId)) {
        clearTimeout(this.activeAuctionTimers.get(auctionId));
      }
      const newTimer = setTimeout(() => this.endAuction(auctionId), 10000);
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
      include: { inventoryItem: true }
    });

    if (!auction || auction.status !== 'active') return;

    await this.prisma.$transaction(async (tx) => {
      await tx.liveAuction.update({
        where: { id: auctionId },
        data: { status: 'finished' }
      });

      if (auction.highestBidderId) {
        const user = await tx.user.findUnique({ where: { id: auction.highestBidderId } });
        await tx.order.create({
          data: {
            inventoryItemId: auction.inventoryItemId,
            productTitle: auction.inventoryItem.titleSnapshot,
            buyerName: user?.name || 'Live Bidder',
            contact: user?.email || 'N/A',
            sellPrice: auction.currentPrice,
            channel: 'live_auction',
            status: 'pending'
          }
        });
        await tx.inventoryItem.update({
          where: { id: auction.inventoryItemId },
          data: { quantity: { decrement: 1 } }
        });
      }
    });

    this.realtime.emitCustom('live.auction_ended', { auctionId, winnerId: auction.highestBidderId });
  }
}