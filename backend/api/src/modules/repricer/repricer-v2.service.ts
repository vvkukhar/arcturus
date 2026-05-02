import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney, calculateRoiPercent } from '../../common/money.utils';

export type RepriceV2Result = {
  inventoryItemId: string;
  title: string;
  totalCost: number;
  compCount: number;
  marketFloor: number | null;
  marketAverage: number | null;
  marketMedian: number | null;
  marketCeiling: number | null;
  suggestedPrice: number;
  floorPrice: number;
  stretchPrice: number;
  roiPercent: number;
  confidence: number;
  mode: 'fast_sale' | 'balanced' | 'premium' | 'manual_review';
  reasons: string[];
};

@Injectable()
export class RepricerV2Service {
  constructor(private readonly prisma: PrismaService) {}

  private median(values: number[]): number | null {
    if (values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  async analyze(params: {
    inventoryItemId: string;
    targetRoiPercent?: number | null;
    mode?: 'fast_sale' | 'balanced' | 'premium' | null;
  }): Promise<RepriceV2Result> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventory) {
      throw new NotFoundException('Inventory item not found');
    }

    const totalCost = toMoney(inventory.totalCost);
    const targetRoi = params.targetRoiPercent ?? 40;

    const comps = await this.prisma.soldComp.findMany({
      where: inventory.item?.setNumber
        ? {
            extractedSetNo: inventory.item.setNumber,
          }
        : {
            normalizedTitle: {
              contains: inventory.titleSnapshot.toLowerCase().slice(0, 18),
              mode: 'insensitive',
            },
          },
      orderBy: {
        soldAt: 'desc',
      },
      take: 60,
    });

    const prices = comps
      .map((x) => Number(x.soldPrice))
      .filter((x) => Number.isFinite(x) && x > 0)
      .sort((a, b) => a - b);

    const reasons: string[] = [];

    const roiBasedPrice = toMoney(totalCost * (1 + targetRoi / 100));

    if (prices.length === 0) {
      const suggestedPrice = Math.round(roiBasedPrice);

      return {
        inventoryItemId: inventory.id,
        title: inventory.titleSnapshot,
        totalCost,
        compCount: 0,
        marketFloor: null,
        marketAverage: null,
        marketMedian: null,
        marketCeiling: null,
        suggestedPrice,
        floorPrice: Math.round(toMoney(totalCost * 1.18)),
        stretchPrice: Math.round(toMoney(totalCost * 1.55)),
        roiPercent: calculateRoiPercent({
          profit: suggestedPrice - totalCost,
          cost: totalCost,
        }),
        confidence: 0.25,
        mode: 'manual_review',
        reasons: [
          'No sold comps found',
          'Suggested price is based only on target ROI',
          'Manual review recommended',
        ],
      };
    }

    const floor = prices[0];
    const ceiling = prices[prices.length - 1];
    const average = prices.reduce((sum, x) => sum + x, 0) / prices.length;
    const median = this.median(prices) ?? average;

    const confidence =
      prices.length >= 20
        ? 0.95
        : prices.length >= 10
          ? 0.82
          : prices.length >= 5
            ? 0.68
            : 0.45;

    let mode: RepriceV2Result['mode'] = params.mode ?? 'balanced';
    let suggested = median;

    if (mode === 'fast_sale') {
      suggested = Math.max(totalCost * 1.15, floor);
      reasons.push('Fast sale mode selected');
    } else if (mode === 'premium') {
      suggested = Math.max(median * 1.08, roiBasedPrice);
      reasons.push('Premium mode selected');
    } else {
      suggested = Math.max(roiBasedPrice, median);
      reasons.push('Balanced pricing mode selected');
    }

    if (suggested > ceiling * 1.08) {
      suggested = ceiling;
      mode = 'manual_review';
      reasons.push('Suggested price exceeded market ceiling, capped to ceiling');
    }

    if (suggested < totalCost * 1.12) {
      suggested = totalCost * 1.12;
      reasons.push('Price lifted to protect minimum margin');
    }

    const suggestedPrice = Math.round(toMoney(suggested));
    const floorPrice = Math.round(toMoney(Math.max(totalCost * 1.1, floor)));
    const stretchPrice = Math.round(toMoney(Math.max(suggestedPrice * 1.1, median * 1.12)));

    const roiPercent = calculateRoiPercent({
      profit: suggestedPrice - totalCost,
      cost: totalCost,
    });

    if (confidence >= 0.8) {
      reasons.push('Sold comps confidence is strong');
    } else {
      reasons.push('Sold comps confidence is limited');
    }

    if (roiPercent >= 40) {
      reasons.push('Target ROI profile is strong');
    } else if (roiPercent < 20) {
      reasons.push('ROI is weak, review before listing');
    }

    return {
      inventoryItemId: inventory.id,
      title: inventory.titleSnapshot,
      totalCost,
      compCount: prices.length,
      marketFloor: toMoney(floor),
      marketAverage: toMoney(average),
      marketMedian: toMoney(median),
      marketCeiling: toMoney(ceiling),
      suggestedPrice,
      floorPrice,
      stretchPrice,
      roiPercent,
      confidence,
      mode,
      reasons,
    };
  }

  async apply(params: {
    inventoryItemId: string;
    price: number;
  }): Promise<unknown> {
    return this.prisma.inventoryItem.update({
      where: {
        id: params.inventoryItemId,
      },
      data: {
        expectedSalePriceManual: toMoney(params.price),
      },
      include: {
        item: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });
  }
}