import { Injectable } from '@nestjs/common';

export type FlipStrategyInput = {
  itemType: string;
  buyPrice: number;
  targetSellPrice: number;
  medianPrice: number;
  soldCount: number;
  volatility: number;
  confidenceScore: number;
};

export type FlipStrategyResult = {
  strategy:
    | 'fast_flip'
    | 'premium_hold'
    | 'bundle_breakdown'
    | 'minifigure_arbitrage'
    | 'slow_hold'
    | 'avoid';
  score: number;
  reasonPrimary: string;
  reasonSecondary: string;
};

@Injectable()
export class FlipStrategyService {
  decide(input: FlipStrategyInput): FlipStrategyResult {
    const spread = input.targetSellPrice - input.buyPrice;
    const roi =
      input.buyPrice > 0 ? ((input.targetSellPrice - input.buyPrice) / input.buyPrice) * 100 : 0;

    if (input.itemType === 'bundle' && roi >= 30) {
      return {
        strategy: 'bundle_breakdown',
        score: 88,
        reasonPrimary: 'Bundle can be separated for higher return',
        reasonSecondary: 'ROI supports breakdown instead of direct resale',
      };
    }

    if (input.itemType === 'minifigure' && roi >= 25 && input.soldCount >= 2) {
      return {
        strategy: 'minifigure_arbitrage',
        score: 84,
        reasonPrimary: 'Minifigure spread is attractive',
        reasonSecondary: 'Sold comps support liquidity',
      };
    }

    if (
      roi >= 35 &&
      spread >= 250 &&
      input.volatility <= 0.35 &&
      input.confidenceScore >= 0.55
    ) {
      return {
        strategy: 'fast_flip',
        score: 90,
        reasonPrimary: 'Strong fast flip setup',
        reasonSecondary: 'Spread, confidence and volatility are aligned',
      };
    }

    if (roi >= 45 && input.soldCount < 2) {
      return {
        strategy: 'premium_hold',
        score: 76,
        reasonPrimary: 'High upside but liquidity is uncertain',
        reasonSecondary: 'Hold for premium buyer instead of rushing',
      };
    }

    if (roi >= 18 && input.confidenceScore >= 0.45) {
      return {
        strategy: 'slow_hold',
        score: 62,
        reasonPrimary: 'Acceptable position',
        reasonSecondary: 'Not urgent, but still viable',
      };
    }

    return {
      strategy: 'avoid',
      score: 35,
      reasonPrimary: 'Weak resale setup',
      reasonSecondary: 'Spread or confidence is not strong enough',
    };
  }
}