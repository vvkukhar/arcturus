import { Injectable } from '@nestjs/common';

export type MinifigureArbitrageInput = {
  buyPrice: number;
  targetSellPrice: number;
  soldCount: number;
  volatility: number;
  confidenceScore: number;
};

export type MinifigureArbitrageResult = {
  score: number;
  action: 'buy' | 'watch' | 'avoid';
  reasonPrimary: string;
  reasonSecondary: string;
};

@Injectable()
export class MinifigureArbitrageService {
  evaluate(input: MinifigureArbitrageInput): MinifigureArbitrageResult {
    const profit = input.targetSellPrice - input.buyPrice;
    const roi = input.buyPrice > 0 ? (profit / input.buyPrice) * 100 : 0;

    if (
      roi >= 35 &&
      profit >= 120 &&
      input.soldCount >= 2 &&
      input.confidenceScore >= 0.5
    ) {
      return {
        score: 88,
        action: 'buy',
        reasonPrimary: 'Strong minifigure arbitrage',
        reasonSecondary: 'ROI, profit and sold comps are aligned',
      };
    }

    if (roi >= 20 && profit >= 70) {
      return {
        score: 66,
        action: 'watch',
        reasonPrimary: 'Possible minifigure flip',
        reasonSecondary: 'Upside exists but confidence is not full',
      };
    }

    return {
      score: 35,
      action: 'avoid',
      reasonPrimary: 'Weak minifigure spread',
      reasonSecondary: 'Not enough profit or liquidity',
    };
  }
}