import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';

export type SmartPricingInput = {
  costBasis: number;
  lowestMarketPrice: number;
  medianMarketPrice: number;
  soldCount: number;
  volatility: number;
  strategy?: string | null;
  marketTrend?: 'up' | 'down' | 'stable'; // Нове поле
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
    const minProfitable = input.costBasis * 1.25; // Мінімальна бажана націнка
    const liquidityBoost = input.soldCount >= 5 ? 1.03 : input.soldCount >= 2 ? 1 : 0.96;
    const volatilityDiscount = input.volatility > 0.45 ? 0.92 : input.volatility > 0.3 ? 0.96 : 1;

    // Враховуємо тренд ринку
    const trendMultiplier = input.marketTrend === 'up' ? 1.05 : input.marketTrend === 'down' ? 0.95 : 1;

    if (input.strategy === 'fast_flip') {
      const floorPrice = Math.max(minProfitable, input.lowestMarketPrice * 0.96);
      const suggestedPrice = Math.max(floorPrice, input.medianMarketPrice * 0.98 * trendMultiplier);
      const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.08 * trendMultiplier);

      return {
        floorPrice: toMoney(floorPrice),
        suggestedPrice: toMoney(suggestedPrice),
        stretchPrice: toMoney(stretchPrice),
        classification: 'aggressive',
        reason: 'Fast flip pricing prioritizes speed while preserving margin (trend adjusted)',
      };
    }

    if (input.strategy === 'premium_hold') {
      const floorPrice = Math.max(minProfitable, input.medianMarketPrice * 0.98);
      const suggestedPrice = Math.max(floorPrice, input.medianMarketPrice * 1.12 * trendMultiplier);
      const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.25 * trendMultiplier);

      return {
        floorPrice: toMoney(floorPrice),
        suggestedPrice: toMoney(suggestedPrice),
        stretchPrice: toMoney(stretchPrice),
        classification: 'premium',
        reason: 'Premium hold pricing targets patient buyer upside (trend adjusted)',
      };
    }

    // Базова логіка (Balanced / Defensive)
    const baseSuggested =
      Math.max(input.medianMarketPrice, minProfitable) *
      liquidityBoost *
      volatilityDiscount *
      trendMultiplier;

    const floorPrice = Math.max(minProfitable, input.lowestMarketPrice * 0.94);
    const suggestedPrice = Math.max(floorPrice, baseSuggested);
    const stretchPrice = Math.max(suggestedPrice, input.medianMarketPrice * 1.12 * trendMultiplier);

    return {
      floorPrice: toMoney(floorPrice),
      suggestedPrice: toMoney(suggestedPrice),
      stretchPrice: toMoney(stretchPrice),
      classification: input.volatility > 0.45 ? 'defensive' : 'balanced',
      reason: input.volatility > 0.45
          ? 'Volatile market requires defensive pricing (trend adjusted)'
          : 'Balanced pricing based on median market, cost basis, and trends',
    };
  }
}