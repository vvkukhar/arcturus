import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketSnapshotRecomputeService {
  constructor(private readonly prisma: PrismaService) {}

  async recomputeForItem(itemId: string, scope = 'ua'): Promise<unknown> {
    const listings = await this.prisma.marketListing.findMany({
      where: { itemId, status: 'active' },
      select: { price: true, shippingPrice: true, sealed: true },
    });

    if (listings.length === 0) {
      return this.prisma.marketSnapshot.create({
        data: { itemId, scope, listingsCount: 0, confidenceScore: 0 },
      });
    }

    let minPrice = Infinity;
    let minPriceWithShipping = Infinity;
    let minShipping = Infinity;
    let maxShipping = -Infinity;
    
    let sumPrice = 0;
    let sumShipping = 0;
    let sumSealed = 0;
    let sumUsed = 0;
    
    let countSealed = 0;
    let countUsed = 0;
    let countShipping = 0;

    const prices: number[] = [];

    for (const item of listings) {
      const p = item.price;
      const s = item.shippingPrice ?? 0;
      const pws = p + s;

      prices.push(p);
      sumPrice += p;

      if (p < minPrice) minPrice = p;
      if (pws < minPriceWithShipping) minPriceWithShipping = pws;

      if (s > 0) {
        sumShipping += s;
        countShipping++;
        if (s < minShipping) minShipping = s;
        if (s > maxShipping) maxShipping = s;
      }

      if (item.sealed) {
        sumSealed += p;
        countSealed++;
      } else {
        sumUsed += p;
        countUsed++;
      }
    }

    prices.sort((a, b) => a - b);

    const avg = sumPrice / listings.length;
    const mid = Math.floor(prices.length / 2);
    const median = prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid];
    
    const confidenceScore = listings.length >= 10 ? 0.95 : listings.length >= 5 ? 0.8 : listings.length >= 2 ? 0.65 : 0.45;

    return this.prisma.marketSnapshot.create({
      data: {
        itemId,
        scope,
        listingsCount: listings.length,
        lowestPrice: minPrice === Infinity ? null : minPrice,
        lowestPriceWithShipping: minPriceWithShipping === Infinity ? null : minPriceWithShipping,
        avgPrice: avg,
        medianPrice: median,
        avgShipping: countShipping > 0 ? sumShipping / countShipping : null,
        minShipping: minShipping === Infinity ? null : minShipping,
        maxShipping: maxShipping === -Infinity ? null : maxShipping,
        sealedAvgPrice: countSealed > 0 ? sumSealed / countSealed : null,
        usedAvgPrice: countUsed > 0 ? sumUsed / countUsed : null,
        confidenceScore,
      },
    });
  }
}