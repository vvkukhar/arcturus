import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MarketSnapshotRecomputeService {
  constructor(private readonly prisma: PrismaService) {}

  async recomputeForItem(itemId: string, scope = 'ua'): Promise<unknown> {
    const rawPrices = await this.prisma.marketListing.findMany({
      where: { itemId, status: 'active' },
      select: { price: true, shippingPrice: true, sealed: true },
      orderBy: { price: 'asc' },
    });

    const listingsCount = rawPrices.length;

    if (listingsCount === 0) {
      return this.prisma.marketSnapshot.create({
        data: { itemId, scope, listingsCount: 0, confidenceScore: 0 },
      });
    }

    let minPriceWithShipping = Infinity;
    let sumSealed = 0;
    let countSealed = 0;
    let sumUsed = 0;
    let countUsed = 0;
    let sumPrice = 0;
    let sumShipping = 0;
    let countShipping = 0;
    let minPrice = Infinity;
    let minShipping = Infinity;
    let maxShipping = -Infinity;

    for (const row of rawPrices) {
      const p = row.price;
      const s = row.shippingPrice ?? 0;
      const pws = p + s;
      
      sumPrice += p;
      if (p < minPrice) minPrice = p;
      if (pws < minPriceWithShipping) minPriceWithShipping = pws;

      if (s > 0) {
        sumShipping += s;
        countShipping++;
        if (s < minShipping) minShipping = s;
        if (s > maxShipping) maxShipping = s;
      }

      if (row.sealed) {
        sumSealed += p;
        countSealed++;
      } else {
        sumUsed += p;
        countUsed++;
      }
    }

    const mid = Math.floor(rawPrices.length / 2);
    const median = rawPrices.length % 2 === 0 ? (rawPrices[mid - 1].price + rawPrices[mid].price) / 2 : rawPrices[mid].price;
    const avg = sumPrice / listingsCount;

    const confidenceScore = listingsCount >= 10 ? 0.95 : listingsCount >= 5 ? 0.8 : listingsCount >= 2 ? 0.65 : 0.45;

    return this.prisma.marketSnapshot.create({
      data: {
        itemId,
        scope,
        listingsCount,
        lowestPrice: minPrice,
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