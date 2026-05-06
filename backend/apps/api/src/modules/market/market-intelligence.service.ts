import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PriceVolatilityService } from './price-volatility.service';
import { SoldCompsService } from './sold-comps.service';

@Injectable()
export class MarketIntelligenceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly volatility: PriceVolatilityService,
    private readonly soldComps: SoldCompsService,
  ) {}

  async getItemIntelligence(itemId: string): Promise<unknown> {
    const [item, snapshot, activeListings, sold] = await Promise.all([
      this.prisma.item.findUnique({
        where: {
          id: itemId,
        },
      }),
      this.prisma.marketSnapshot.findFirst({
        where: {
          itemId,
        },
        orderBy: {
          computedAt: 'desc',
        },
      }),
      this.prisma.marketListing.findMany({
        where: {
          itemId,
          status: 'active',
        },
        orderBy: {
          price: 'asc',
        },
        take: 50,
        include: {
          source: true,
        },
      }),
      this.soldComps.getSoldCompSummary(itemId),
    ]);

    const prices = activeListings.map((x) => x.price);
    const volatility = this.volatility.calculate(prices);

    const lowest = activeListings[0] ?? null;
    const spread =
      snapshot?.medianPrice && snapshot?.lowestPriceWithShipping
        ? snapshot.medianPrice - snapshot.lowestPriceWithShipping
        : null;

    let marketState = 'unknown';

    if (!snapshot || snapshot.listingsCount === 0) {
      marketState = 'empty_market';
    } else if (volatility >= 0.45) {
      marketState = 'volatile';
    } else if ((sold.soldCount ?? 0) >= 8) {
      marketState = 'liquid';
    } else if ((snapshot.confidenceScore ?? 0) < 0.5) {
      marketState = 'low_confidence';
    } else {
      marketState = 'stable';
    }

    return {
      item,
      snapshot,
      activeListingCount: activeListings.length,
      lowestListing: lowest,
      sold,
      volatility,
      spread,
      marketState,
      recommendation:
        marketState === 'liquid'
          ? 'Good candidate for active trading'
          : marketState === 'volatile'
            ? 'Use conservative buy price and manual review'
            : marketState === 'empty_market'
              ? 'Needs external research'
              : 'Monitor',
    };
  }
}