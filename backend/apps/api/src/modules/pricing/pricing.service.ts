import { Injectable } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { SmartPricingService } from '../strategy/smart-pricing.service';

@Injectable()
export class PricingService {
  constructor(private readonly smartPricing: SmartPricingService) {}

  calculateROI(params: { buyPrice: number; sellPrice: number }): number {
    const buyPrice = toMoney(params.buyPrice);
    const sellPrice = toMoney(params.sellPrice);
    const profit = calculateProfit({ revenue: sellPrice, cost: buyPrice });
    return calculateRoiPercent({ profit, cost: buyPrice });
  }

  analyze(params: {
    buyPrice: number;
    sellPrice?: number | null;
    marketFloor?: number | null;
    marketAverage?: number | null;
    targetRoiPercent?: number | null;
  }): unknown {
    const buyPrice = toMoney(params.buyPrice);
    const targetRoiPercent = params.targetRoiPercent ?? 35;

    const fallbackSellPrice = buyPrice * (1 + targetRoiPercent / 100);
    const sellPrice = toMoney(params.sellPrice ?? fallbackSellPrice);

    const profit = calculateProfit({ revenue: sellPrice, cost: buyPrice });
    const roi = calculateRoiPercent({ profit, cost: buyPrice });

    const smart = this.smartPricing.suggest({
      costBasis: buyPrice,
      lowestMarketPrice: params.marketFloor ?? sellPrice * 0.9,
      medianMarketPrice: params.marketAverage ?? sellPrice,
      soldCount: 0,
      volatility: 0.25,
      strategy: roi >= 35 ? 'fast_flip' : 'slow_hold',
    });

    let classification = 'weak';
    if (roi >= 45 && profit >= 300) classification = 'excellent';
    else if (roi >= 30 && profit >= 150) classification = 'good';
    else if (roi >= 18) classification = 'acceptable';

    return {
      buyPrice,
      sellPrice,
      profit,
      roi,
      classification,
      suggestedSellPrice: smart.suggestedPrice,
      floorPrice: smart.floorPrice,
      stretchPrice: smart.stretchPrice,
      reason: smart.reason,
    };
  }
}