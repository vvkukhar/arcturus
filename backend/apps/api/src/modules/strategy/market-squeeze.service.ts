import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityService } from '../activity/activity.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class MarketSqueezeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
  ) {}

  async evaluateMarketSqueeze(): Promise<{ adjustments: number }> {
    const activeInventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      include: { item: true },
    });

    let adjustments = 0;
    const dbOperations = [];

    for (const inventory of activeInventory) {
      const snapshots = await this.prisma.marketSnapshot.findMany({
        where: { itemId: inventory.itemId },
        orderBy: { computedAt: 'desc' },
        take: 3,
      });

      if (snapshots.length < 3) continue;

      const [latest, previous, oldest] = snapshots;

      const supplyDrop = oldest.listingsCount > 0 
        ? ((oldest.listingsCount - latest.listingsCount) / oldest.listingsCount) 
        : 0;

      const priceSpike = previous.lowestPriceWithShipping && latest.lowestPriceWithShipping
        ? ((latest.lowestPriceWithShipping - previous.lowestPriceWithShipping) / previous.lowestPriceWithShipping)
        : 0;

      if (supplyDrop >= 0.4 || priceSpike >= 0.15) {
        const currentPrice = inventory.expectedSalePriceManual ?? inventory.totalCost;
        const premiumMultiplier = supplyDrop >= 0.6 ? 1.35 : 1.20;
        const newPrice = toMoney(currentPrice * premiumMultiplier);

        dbOperations.push(
          this.prisma.inventoryItem.update({
            where: { id: inventory.id },
            data: { expectedSalePriceManual: newPrice },
          }),
          this.prisma.activityLog.create({
            data: {
              action: 'strategy.market_squeeze_applied',
              payloadJson: {
                inventoryItemId: inventory.id,
                oldPrice: currentPrice,
                newPrice,
                supplyDropPercent: toMoney(supplyDrop * 100),
                priceSpikePercent: toMoney(priceSpike * 100),
              },
            },
          })
        );
        adjustments++;
      }
    }

    if (dbOperations.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < dbOperations.length; i += chunkSize) {
        await this.prisma.$transaction(dbOperations.slice(i, i + chunkSize));
      }
    }

    return { adjustments };
  }
}