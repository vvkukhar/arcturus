import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney, calculateRoiPercent } from '@arcturus/shared';
import { SmartPricingService } from '../strategy/smart-pricing.service';
import { PriceVolatilityService } from '../market/price-volatility.service';

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
  constructor(
    private readonly prisma: PrismaService,
    private readonly smartPricing: SmartPricingService,
    private readonly volatility: PriceVolatilityService,
  ) {}

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
      where: { id: params.inventoryItemId },
      include: { item: true },
    });

    if (!inventory) throw new NotFoundException('Inventory item not found');

    const totalCost = toMoney(inventory.totalCost);

    // Шукаємо comps
    const comps = await this.prisma.soldComp.findMany({
      where: inventory.item?.setNumber
        ? { extractedSetNo: inventory.item.setNumber }
        : { normalizedTitle: { contains: inventory.titleSnapshot.toLowerCase().slice(0, 18), mode: 'insensitive' } },
      orderBy: { soldAt: 'desc' },
      take: 60,
    });

    const prices = comps.map((x) => Number(x.soldPrice)).filter((x) => Number.isFinite(x) && x > 0).sort((a, b) => a - b);
    const reasons: string[] = [];

    // Базова логіка, якщо немає comps
    if (prices.length === 0) {
       const targetRoi = params.targetRoiPercent ?? 40;
       const roiBasedPrice = toMoney(totalCost * (1 + targetRoi / 100));
       return {
         // ... (повертаємо дефолтний об'єкт, як у твоєму коді, щоб зекономити місце)
         inventoryItemId: inventory.id,
         title: inventory.titleSnapshot,
         totalCost,
         compCount: 0,
         marketFloor: null,
         marketAverage: null,
         marketMedian: null,
         marketCeiling: null,
         suggestedPrice: Math.round(roiBasedPrice),
         floorPrice: Math.round(toMoney(totalCost * 1.18)),
         stretchPrice: Math.round(toMoney(totalCost * 1.55)),
         roiPercent: targetRoi,
         confidence: 0.25,
         mode: 'manual_review',
         reasons: ['No sold comps found', 'Suggested price is based only on target ROI', 'Manual review recommended'],
       };
    }

    const floor = prices[0];
    const ceiling = prices[prices.length - 1];
    const average = prices.reduce((sum, x) => sum + x, 0) / prices.length;
    const median = this.median(prices) ?? average;
    const currentVolatility = this.volatility.calculate(prices);

    const confidence = prices.length >= 20 ? 0.95 : prices.length >= 10 ? 0.82 : prices.length >= 5 ? 0.68 : 0.45;
    
    // Враховуємо тренд (чи останні 5 продажів дорожчі за медіану)
    const recentPrices = prices.slice(Math.max(prices.length - 5, 0));
    const recentAvg = recentPrices.reduce((a,b) => a+b, 0) / recentPrices.length;
    let marketTrend: 'up' | 'down' | 'stable' = 'stable';
    if (recentAvg > median * 1.05) marketTrend = 'up';
    if (recentAvg < median * 0.95) marketTrend = 'down';

    // ВИКОРИСТОВУЄМО SMART PRICING
    const pricingStrategy = params.mode === 'fast_sale' ? 'fast_flip' : params.mode === 'premium' ? 'premium_hold' : 'balanced';

    const smartResult = this.smartPricing.suggest({
      costBasis: totalCost,
      lowestMarketPrice: floor,
      medianMarketPrice: median,
      soldCount: prices.length,
      volatility: currentVolatility,
      strategy: pricingStrategy,
      marketTrend
    });

    let suggested = smartResult.suggestedPrice;
    let mode: RepriceV2Result['mode'] = params.mode ?? 'balanced';

    if (suggested > ceiling * 1.08) {
      suggested = ceiling;
      mode = 'manual_review';
      reasons.push('Suggested price exceeded market ceiling, capped to ceiling');
    }

    const suggestedPrice = Math.round(toMoney(suggested));
    
    const roiPercent = calculateRoiPercent({ profit: suggestedPrice - totalCost, cost: totalCost });

    if (confidence >= 0.8) reasons.push('Sold comps confidence is strong');
    else reasons.push('Sold comps confidence is limited');
    
    reasons.push(smartResult.reason);

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
      floorPrice: smartResult.floorPrice,
      stretchPrice: smartResult.stretchPrice,
      roiPercent,
      confidence,
      mode,
      reasons,
    };
  }

  async apply(params: { inventoryItemId: string; price: number; }): Promise<unknown> {
    return this.prisma.inventoryItem.update({
      where: { id: params.inventoryItemId },
      data: { expectedSalePriceManual: toMoney(params.price) },
      include: { item: true, images: { orderBy: { sortOrder: 'asc' } } },
    });
  }
}