import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketSnapshotRecomputeService {
  constructor(private readonly prisma: PrismaService) {}

  async recomputeForItem(itemId: string, scope = 'ua'): Promise<unknown> {
    const agg = await this.prisma.marketListing.aggregate({
      where: { itemId, status: 'active' },
      _count: { _all: true },
      _min: { price: true, shippingPrice: true },
      _max: { shippingPrice: true },
      _avg: { price: true, shippingPrice: true },
    });

    const listingsCount = agg._count._all;

    if (listingsCount === 0) {
      return this.prisma.marketSnapshot.create({
        data: { itemId, scope, listingsCount: 0, confidenceScore: 0 },
      });
    }

    const rawPrices = await this.prisma.marketListing.findMany({
      where: { itemId, status: 'active' },
      select: { price: true, shippingPrice: true, sealed: true },
      orderBy: { price: 'asc' },
    });

    let minPriceWithShipping = Infinity;
    let sumSealed = 0;
    let countSealed = 0;
    let sumUsed = 0;
    let countUsed = 0;

    for (const row of rawPrices) {
      const p = Number(row.price);
      const s = Number(row.shippingPrice ?? 0);
      const pws = p + s;
      
      if (pws < minPriceWithShipping) minPriceWithShipping = pws;

      if (row.sealed) {
        sumSealed += p;
        countSealed++;
      } else {
        sumUsed += p;
        countUsed++;
      }
    }

    const mid = Math.floor(rawPrices.length / 2);
    const median = rawPrices.length % 2 === 0 
      ? (Number(rawPrices[mid - 1].price) + Number(rawPrices[mid].price)) / 2 
      : Number(rawPrices[mid].price);

    const confidenceScore = listingsCount >= 10 ? 0.95 : listingsCount >= 5 ? 0.8 : listingsCount >= 2 ? 0.65 : 0.45;

    return this.prisma.marketSnapshot.create({
      data: {
        itemId,
        scope,
        listingsCount,
        lowestPrice: agg._min.price,
        lowestPriceWithShipping: minPriceWithShipping === Infinity ? null : minPriceWithShipping,
        avgPrice: agg._avg.price,
        medianPrice: median,
        avgShipping: agg._avg.shippingPrice,
        minShipping: agg._min.shippingPrice,
        maxShipping: agg._max.shippingPrice,
        sealedAvgPrice: countSealed > 0 ? sumSealed / countSealed : null,
        usedAvgPrice: countUsed > 0 ? sumUsed / countUsed : null,
        confidenceScore,
      },
    });
  }
}