import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class MarketSnapshotService {
  private readonly logger = new Logger(MarketSnapshotService.name);

  constructor(private readonly prisma: PrismaService) {}

  async recomputeSnapshot(itemId: string): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const listings = await this.prisma.marketListing.findMany({
      where: {
        itemId,
        status: 'active',
        lastSeenAt: { gte: thirtyDaysAgo },
      },
      select: {
        price: true,
        shippingPrice: true,
        sealed: true,
      },
    });

    if (listings.length === 0) {
      await this.prisma.marketSnapshot.create({
        data: {
          itemId,
          listingsCount: 0,
          confidenceScore: new Prisma.Decimal(0),
        },
      });
      return;
    }

    const prices = listings.map(l => Number(l.price)).sort((a, b) => a - b);
    const shippingPrices = listings.map(l => Number(l.shippingPrice || 0)).filter(p => p > 0);
    
    const sealedPrices = listings.filter(l => l.sealed).map(l => Number(l.price));
    const usedPrices = listings.filter(l => !l.sealed).map(l => Number(l.price));

    const q1Index = Math.floor(prices.length * 0.25);
    const q3Index = Math.floor(prices.length * 0.75);
    const iqr = prices[q3Index] - prices[q1Index];
    const lowerBound = prices[q1Index] - 1.5 * iqr;
    const upperBound = prices[q3Index] + 1.5 * iqr;

    const filteredPrices = prices.filter(p => p >= lowerBound && p <= upperBound);
    
    if (filteredPrices.length === 0) filteredPrices.push(...prices);

    const lowestPrice = Math.min(...filteredPrices);
    const sumPrice = filteredPrices.reduce((a, b) => a + b, 0);
    const avgPrice = sumPrice / filteredPrices.length;
    const medianPrice = filteredPrices[Math.floor(filteredPrices.length / 2)];

    const minShipping = shippingPrices.length > 0 ? Math.min(...shippingPrices) : 0;
    const maxShipping = shippingPrices.length > 0 ? Math.max(...shippingPrices) : 0;
    const avgShipping = shippingPrices.length > 0 
      ? shippingPrices.reduce((a, b) => a + b, 0) / shippingPrices.length 
      : 0;

    const sealedAvg = sealedPrices.length > 0 ? sealedPrices.reduce((a, b) => a + b, 0) / sealedPrices.length : null;
    const usedAvg = usedPrices.length > 0 ? usedPrices.reduce((a, b) => a + b, 0) / usedPrices.length : null;

    let confidence = 0;
    if (listings.length >= 10) confidence = 0.95;
    else if (listings.length >= 5) confidence = 0.75;
    else if (listings.length >= 2) confidence = 0.40;
    else confidence = 0.10;

    await this.prisma.marketSnapshot.create({
      data: {
        itemId,
        listingsCount: listings.length,
        lowestPrice: new Prisma.Decimal(lowestPrice),
        lowestPriceWithShipping: new Prisma.Decimal(lowestPrice + minShipping),
        avgPrice: new Prisma.Decimal(avgPrice),
        medianPrice: new Prisma.Decimal(medianPrice),
        minShipping: new Prisma.Decimal(minShipping),
        maxShipping: new Prisma.Decimal(maxShipping),
        avgShipping: new Prisma.Decimal(avgShipping),
        sealedAvgPrice: sealedAvg ? new Prisma.Decimal(sealedAvg) : null,
        usedAvgPrice: usedAvg ? new Prisma.Decimal(usedAvg) : null,
        confidenceScore: new Prisma.Decimal(confidence),
      },
    });

    this.logger.log(`Recomputed snapshot for item ${itemId}. Median: ${medianPrice}, Confidence: ${confidence}`);
  }

  async recomputeAllActive(): Promise<number> {
    const activeItems = await this.prisma.marketListing.groupBy({
      by: ['itemId'],
      where: { status: 'active' },
    });

    let count = 0;
    for (const item of activeItems) {
      if (item.itemId && item.itemId !== 'UNRESOLVED') {
        await this.recomputeSnapshot(item.itemId);
        count++;
      }
    }
    return count;
  }
}