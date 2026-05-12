import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DealDetectionService {
  private readonly logger = new Logger(DealDetectionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async analyzeNewListings(itemIds: string[]): Promise<number> {
    let dealsCreated = 0;
    const uniqueIds = Array.from(new Set(itemIds)).filter(id => id !== 'UNRESOLVED');
    if (uniqueIds.length === 0) return 0;

    const activeListings = await this.prisma.marketListing.findMany({
      where: { itemId: { in: uniqueIds }, status: 'active' },
      select: { id: true, itemId: true, price: true, shippingPrice: true }
    });

    if (!activeListings.length) return 0;

    const watchlistRules = await this.prisma.watchlistItem.findMany({
      where: { itemId: { in: uniqueIds }, active: true },
    });

    const snapshots = await this.prisma.marketSnapshot.findMany({
      where: { itemId: { in: uniqueIds } },
      orderBy: { computedAt: 'desc' },
      distinct: ['itemId'],
    });

    const watchlistMap = new Map<string, typeof watchlistRules>();
    for (const rule of watchlistRules) {
      const arr = watchlistMap.get(rule.itemId) || [];
      arr.push(rule);
      watchlistMap.set(rule.itemId, arr);
    }

    const snapshotMap = new Map(snapshots.map(s => [s.itemId, s]));
    const creates: any[] = [];

    for (const listing of activeListings) {
      const listingPrice = Number(listing.price);
      const shippingPrice = Number(listing.shippingPrice || 0);
      const totalAcquisitionCost = listingPrice + shippingPrice;

      const rules = watchlistMap.get(listing.itemId) || [];
      const snapshot = snapshotMap.get(listing.itemId);

      if (rules.length > 0) {
        for (const rule of rules) {
          if (totalAcquisitionCost <= Number(rule.maxBuyPrice)) {
            const targetSellPrice = Number(rule.targetSellPrice || snapshot?.medianPrice || 0);
            if (targetSellPrice > totalAcquisitionCost) {
              const profit = targetSellPrice - totalAcquisitionCost;
              const roiPercent = (profit / totalAcquisitionCost) * 100;
              
              if (roiPercent >= 20) {
                creates.push({
                  id: `${listing.id}_${rule.id}`,
                  listingId: listing.id,
                  watchlistItemId: rule.id,
                  buyPrice: totalAcquisitionCost,
                  targetSellPrice,
                  profit,
                  roiPercent,
                  action: roiPercent >= 30 && totalAcquisitionCost <= Number(rule.desiredBuyPrice) ? 'BUY_NOW' : 'BUY',
                  score: roiPercent >= 30 ? 95 : 78,
                  status: 'open',
                });
                dealsCreated++;
              }
            }
          }
        }
      } else if (snapshot && snapshot.medianPrice && Number(snapshot.confidenceScore) > 0.5) {
        const median = Number(snapshot.medianPrice);
        if (totalAcquisitionCost < median * 0.6) {
          creates.push({
            id: `${listing.id}_SYS`,
            listingId: listing.id,
            watchlistItemId: 'SYSTEM_DETECTED',
            buyPrice: totalAcquisitionCost,
            targetSellPrice: median * 0.95,
            profit: (median * 0.95) - totalAcquisitionCost,
            roiPercent: (((median * 0.95) - totalAcquisitionCost) / totalAcquisitionCost) * 100,
            action: 'STRONG_BUY',
            score: 85,
            status: 'open',
          });
          dealsCreated++;
        }
      }
    }

    if (creates.length > 0) {
      await this.prisma.$transaction(
        creates.map((deal) =>
          this.prisma.deal.upsert({
            where: { id: deal.id },
            create: { ...deal },
            update: {
              buyPrice: deal.buyPrice,
              targetSellPrice: deal.targetSellPrice,
              profit: deal.profit,
              roiPercent: deal.roiPercent,
              score: deal.score,
              action: deal.action,
              updatedAt: new Date(),
            },
          })
        )
      );
    }

    return dealsCreated;
  }

  async pruneStaleDeals(): Promise<void> {
    const batchSize = 1000;
    let hasMore = true;
    let lastId: string | undefined = undefined;

    while (hasMore) {
      const staleDeals = await this.prisma.deal.findMany({
        where: { 
          status: 'open',
          listing: { status: { not: 'active' } } 
        },
        select: { id: true },
        take: batchSize,
        skip: lastId ? 1 : undefined,
        cursor: lastId ? { id: lastId } : undefined,
      });

      if (staleDeals.length === 0) {
        hasMore = false;
        break;
      }

      lastId = staleDeals[staleDeals.length - 1].id;

      await this.prisma.deal.updateMany({
        where: { id: { in: staleDeals.map(d => d.id) } },
        data: { status: 'missed', updatedAt: new Date() },
      });
    }
  }
}