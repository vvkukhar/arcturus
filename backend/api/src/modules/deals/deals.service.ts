import { Injectable } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '../../common/money.utils';
import { ActivityService } from '../activity/activity.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class DealsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  async detectDeals(): Promise<unknown[]> {
    const listings = await this.prisma.marketListing.findMany({
      where: { status: 'active' },
      include: { item: true, source: true },
      orderBy: { fetchedAt: 'desc' },
      take: 500,
    });

    if (listings.length === 0) return [];

    const itemIds = [...new Set(listings.map((l) => l.itemId))];

    const watchlistItems = await this.prisma.watchlistItem.findMany({
      where: { itemId: { in: itemIds }, active: true },
      include: { assignedUser: true },
    });

    if (watchlistItems.length === 0) return [];

    const watchlistMap = new Map<string, typeof watchlistItems>();
    for (const w of watchlistItems) {
      const arr = watchlistMap.get(w.itemId) || [];
      arr.push(w);
      watchlistMap.set(w.itemId, arr);
    }

    const existingDeals = await this.prisma.deal.findMany({
      where: { listingId: { in: listings.map((l) => l.id) } },
    });

    const existingDealsMap = new Map(
      existingDeals.map((d) => [`${d.listingId}_${d.watchlistItemId}`, d]),
    );

    const createdOrUpdated: unknown[] = [];
    const notificationsToSend: any[] = [];
    const dbOperations: any[] = [];

    for (const listing of listings) {
      const matchedWatchlists = watchlistMap.get(listing.itemId) || [];

      for (const watchlist of matchedWatchlists) {
        const buyPrice = toMoney(Number(listing.price) + Number(listing.shippingPrice ?? 0));
        const targetSellPrice = toMoney(watchlist.targetSellPrice ?? watchlist.maxBuyPrice * 1.4);
        const profit = calculateProfit({ revenue: targetSellPrice, cost: buyPrice });
        const roiPercent = calculateRoiPercent({ profit, cost: buyPrice });

        let action = 'SKIP';
        let score = 35;

        if (buyPrice <= watchlist.desiredBuyPrice && roiPercent >= 30) {
          action = 'BUY_NOW';
          score = 92;
        } else if (buyPrice <= watchlist.maxBuyPrice && roiPercent >= 20) {
          action = 'BUY';
          score = 78;
        } else if (buyPrice <= watchlist.maxBuyPrice) {
          action = 'WATCH';
          score = 60;
        }

        if (action === 'SKIP') continue;

        const dealKey = `${listing.id}_${watchlist.id}`;
        const existing = existingDealsMap.get(dealKey);

        const dealData = {
          buyPrice,
          targetSellPrice,
          profit,
          roiPercent,
          action,
          score,
          status: 'open',
        };

        if (existing) {
          dbOperations.push(
            this.prisma.deal.update({
              where: { id: existing.id },
              data: dealData,
              include: {
                listing: { include: { item: true, source: true } },
                watchlistItem: { include: { assignedUser: true } },
              },
            })
          );
        } else {
          dbOperations.push(
            this.prisma.deal.create({
              data: {
                listingId: listing.id,
                watchlistItemId: watchlist.id,
                ...dealData,
              },
              include: {
                listing: { include: { item: true, source: true } },
                watchlistItem: { include: { assignedUser: true } },
              },
            })
          );
        }

        if (action === 'BUY_NOW') {
          notificationsToSend.push({
            itemTitle: watchlist.titleSnapshot,
            roi: roiPercent,
            action,
            targetUserId: watchlist.assignedUserId ?? null,
          });
        }
      }
    }

    if (dbOperations.length > 0) {
      const results = await this.prisma.$transaction(dbOperations);
      createdOrUpdated.push(...results);

      for (const notification of notificationsToSend) {
        await this.notifications.createDealNotification(notification);
      }
    }

    await this.activity.log('deals.detected', {
      count: createdOrUpdated.length,
    });

    this.realtime.emitOpportunityRefresh('deals_detected');
    this.realtime.emitDashboardRefresh('deals_detected');

    return createdOrUpdated;
  }

  async list(params?: { status?: string; action?: string; limit?: number }): Promise<unknown[]> {
    return this.prisma.deal.findMany({
      where: {
        ...(params?.status && params.status !== 'all' ? { status: params.status } : {}),
        ...(params?.action && params.action !== 'all' ? { action: params.action } : {}),
      },
      include: {
        listing: { include: { item: true, source: true } },
        watchlistItem: { include: { item: true, assignedUser: true } },
      },
      orderBy: [{ score: 'desc' }, { createdAt: 'desc' }],
      take: params?.limit ?? 100,
    });
  }

  async updateStatus(params: { id: string; status: string }): Promise<unknown> {
    const updated = await this.prisma.deal.update({
      where: { id: params.id },
      data: { status: params.status },
      include: { listing: true, watchlistItem: true },
    });

    await this.activity.log('deal.status_updated', {
      dealId: updated.id,
      status: updated.status,
    });

    this.realtime.emitOpportunityRefresh('deal_status_updated');

    return updated;
  }

  async stats(): Promise<unknown> {
    const deals = await this.prisma.deal.findMany();
    return {
      total: deals.length,
      open: deals.filter((deal) => deal.status === 'open').length,
      buyNow: deals.filter((deal) => deal.action === 'BUY_NOW').length,
      buy: deals.filter((deal) => deal.action === 'BUY').length,
      watch: deals.filter((deal) => deal.action === 'WATCH').length,
      avgRoi: deals.length > 0
        ? toMoney(deals.reduce((sum, deal) => sum + Number(deal.roiPercent), 0) / deals.length)
        : 0,
      totalPotentialProfit: toMoney(
        deals.filter((deal) => deal.status === 'open').reduce((sum, deal) => sum + Number(deal.profit), 0),
      ),
    };
  }
}