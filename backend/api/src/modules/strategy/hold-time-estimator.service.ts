import { Injectable } from '@nestjs/common';

export type HoldTimeInput = {
  soldPerMonth: number;
  stockCount: number;
};

export type HoldTimeResult = {
  estimatedDays: number;
  liquidityTier: 'fast' | 'medium' | 'slow';
};

@Injectable()
export class HoldTimeEstimatorService {
  estimate(input: HoldTimeInput): HoldTimeResult {
    if (input.soldPerMonth <= 0) {
      return {
        estimatedDays: 999,
        liquidityTier: 'slow',
      };
    }

    const monthsToSell = input.stockCount / input.soldPerMonth;
    const days = monthsToSell * 30;

    let tier: HoldTimeResult['liquidityTier'] = 'medium';

    if (days <= 14) {
      tier = 'fast';
    } else if (days >= 45) {
      tier = 'slow';
    }

    return {
      estimatedDays: Math.round(days),
      liquidityTier: tier,
    };
  }
}