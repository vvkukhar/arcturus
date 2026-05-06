import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';

export type SmartPricingInput = {
  costBasis: number;
  lowestMarketPrice: number;
  medianMarketPrice: number;
  soldCount: number;
  volatility: number;
  strategy?: string | null;
};

export type SmartPricingResult = {
  floorPrice: number;
  suggestedPrice: number;
  stretchPrice: number;
  classification: 'aggressive' | 'balanced' | 'premium' | 'defensive';
  reason: string;
};

@Injectable()
export class SmartPricingService {
  suggest(input: SmartPricingInput): SmartPricingResult {
    const minProfitable = input.costBasis * 1.25;
    const liquidityBoost = input.soldCount >= 5 ? 1.03 : input.soldCount >= 2 ? 1 : 0.96;
    const volatilityDiscount = input.volatility > 0.45 ? 0.92 : input.volatility > 0.3 ? 0.96 : 1;

    if (input.strategy === 'fast_flip') {
      const floorPrice = Math.max(minProfitable, input.lowestMarketPrice * 0.96);
      const suggestedPrice = Math.max(floorPrice, input.medianMarketPrice * 0.98);
      const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.08);

      return {
        floorPrice: toMoney(floorPrice),
        suggestedPrice: toMoney(suggestedPrice),
        stretchPrice: toMoney(stretchPrice),
        classification: 'aggressive',
        reason: 'Fast flip pricing prioritizes speed while preserving margin',
      };
    }

    if (input.strategy === 'premium_hold') {
      const floorPrice = Math.max(minProfitable, input.medianMarketPrice * 0.98);
      const suggestedPrice = Math.max(floorPrice, input.medianMarketPrice * 1.12);
      const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.25);

      return {
        floorPrice: toMoney(floorPrice),
        suggestedPrice: toMoney(suggestedPrice),
        stretchPrice: toMoney(stretchPrice),
        classification: 'premium',
        reason: 'Premium hold pricing targets patient buyer upside',
      };
    }

    const baseSuggested =
      Math.max(input.medianMarketPrice, minProfitable) *
      liquidityBoost *
      volatilityDiscount;

    const floorPrice = Math.max(minProfitable, input.lowestMarketPrice * 0.94);
    const suggestedPrice = Math.max(floorPrice, baseSuggested);
    const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.12);

    return {
      floorPrice: toMoney(floorPrice),
      suggestedPrice: toMoney(suggestedPrice),
      stretchPrice: toMoney(stretchPrice),
      classification: input.volatility > 0.45 ? 'defensive' : 'balanced',
      reason:
        input.volatility > 0.45
          ? 'Volatile market requires defensive pricing'
          : 'Balanced pricing based on median market and cost basis',
    };
  }
}