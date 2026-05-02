import { Injectable } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';
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
      where: {
        status: 'active',
      },
      include: {
        item: true,
        source: true,
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: 500,
    });

    const createdOrUpdated: unknown[] = [];

    for (const listing of listings) {
      const watchlistItems = await this.prisma.watchlistItem.findMany({
        where: {
          itemId: listing.itemId,
          active: true,
        },
        include: {
          assignedUser: true,
        },
      });

      if (watchlistItems.length === 0) {
        continue;
      }

      for (const watchlist of watchlistItems) {
        const buyPrice = toMoney(
          Number(listing.price) + Number(listing.shippingPrice ?? 0),
        );

        const targetSellPrice = toMoney(
          watchlist.targetSellPrice ?? watchlist.maxBuyPrice * 1.4,
        );

        const profit = calculateProfit({
          revenue: targetSellPrice,
          cost: buyPrice,
        });

        const roiPercent = calculateRoiPercent({
          profit,
          cost: buyPrice,
        });

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

        if (action === 'SKIP') {
          continue;
        }

        const existing = await this.prisma.deal.findFirst({
          where: {
            listingId: listing.id,
            watchlistItemId: watchlist.id,
          },
        });

        const deal = existing
          ? await this.prisma.deal.update({
              where: {
                id: existing.id,
              },
              data: {
                buyPrice,
                targetSellPrice,
                profit,
                roiPercent,
                action,
                score,
                status: 'open',
              },
              include: {
                listing: {
                  include: {
                    item: true,
                    source: true,
                  },
                },
                watchlistItem: {
                  include: {
                    assignedUser: true,
                  },
                },
              },
            })
          : await this.prisma.deal.create({
              data: {
                listingId: listing.id,
                watchlistItemId: watchlist.id,
                buyPrice,
                targetSellPrice,
                profit,
                roiPercent,
                action,
                score,
                status: 'open',
              },
              include: {
                listing: {
                  include: {
                    item: true,
                    source: true,
                  },
                },
                watchlistItem: {
                  include: {
                    assignedUser: true,
                  },
                },
              },
            });

        createdOrUpdated.push(deal);

        if (action === 'BUY_NOW') {
          await this.notifications.createDealNotification({
            itemTitle: watchlist.titleSnapshot,
            roi: roiPercent,
            action,
            targetUserId: watchlist.assignedUserId ?? null,
          });
        }
      }
    }

    await this.activity.log('deals.detected', {
      count: createdOrUpdated.length,
    });

    this.realtime.emitOpportunityRefresh('deals_detected');
    this.realtime.emitDashboardRefresh('deals_detected');

    return createdOrUpdated;
  }

  async list(params?: {
    status?: string;
    action?: string;
    limit?: number;
  }): Promise<unknown[]> {
    return this.prisma.deal.findMany({
      where: {
        ...(params?.status && params.status !== 'all'
          ? {
              status: params.status,
            }
          : {}),
        ...(params?.action && params.action !== 'all'
          ? {
              action: params.action,
            }
          : {}),
      },
      include: {
        listing: {
          include: {
            item: true,
            source: true,
          },
        },
        watchlistItem: {
          include: {
            item: true,
            assignedUser: true,
          },
        },
      },
      orderBy: [
        {
          score: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
      take: params?.limit ?? 100,
    });
  }

  async updateStatus(params: {
    id: string;
    status: string;
  }): Promise<unknown> {
    const updated = await this.prisma.deal.update({
      where: {
        id: params.id,
      },
      data: {
        status: params.status,
      },
      include: {
        listing: true,
        watchlistItem: true,
      },
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
      avgRoi:
        deals.length > 0
          ? toMoney(
              deals.reduce((sum, deal) => sum + Number(deal.roiPercent), 0) /
                deals.length,
            )
          : 0,
      totalPotentialProfit: toMoney(
        deals
          .filter((deal) => deal.status === 'open')
          .reduce((sum, deal) => sum + Number(deal.profit), 0),
      ),
    };
  }
}