import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';

export type SoldCompSummary = {
  itemId: string;
  soldCount: number;
  avgSoldPrice: number | null;
  medianSoldPrice: number | null;
  lowestSoldPrice: number | null;
  highestSoldPrice: number | null;
};

@Injectable()
export class SoldCompsService {
  constructor(private readonly prisma: PrismaService) {}

  private avg(values: number[]): number | null {
    if (values.length === 0) {
      return null;
    }

    const total = values.reduce((sum, value) => sum + value, 0);
    return toMoney(total / values.length);
  }

  private median(values: number[]): number | null {
    if (values.length === 0) {
      return null;
    }

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    const value =
      sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];

    return toMoney(value);
  }

  async getSoldCompSummary(itemId: string): Promise<SoldCompSummary> {
    const listings = await this.prisma.marketListing.findMany({
      where: {
        itemId,
        status: 'sold',
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      take: 100,
    });

    const prices = listings
      .map((listing) => listing.price)
      .filter((price) => Number.isFinite(price) && price > 0)
      .sort((a, b) => a - b);

    return {
      itemId,
      soldCount: listings.length,
      avgSoldPrice: this.avg(prices),
      medianSoldPrice: this.median(prices),
      lowestSoldPrice: prices.length > 0 ? toMoney(prices[0]) : null,
      highestSoldPrice:
        prices.length > 0 ? toMoney(prices[prices.length - 1]) : null,
    };
  }
}