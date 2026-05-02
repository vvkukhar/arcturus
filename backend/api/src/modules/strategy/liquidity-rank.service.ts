import { Injectable } from '@nestjs/common';

export type LiquidityRankInput = {
  soldCount: number;
  volatility: number;
  confidence: number;
};

export type LiquidityRankResult = {
  score: number;
  tier: 'A' | 'B' | 'C' | 'D';
};

@Injectable()
export class LiquidityRankService {
  rank(input: LiquidityRankInput): LiquidityRankResult {
    let score =
      input.soldCount * 5 +
      (1 - input.volatility) * 40 +
      input.confidence * 30;

    score = Math.max(0, Math.min(100, score));

    let tier: LiquidityRankResult['tier'] = 'D';

    if (score >= 80) {
      tier = 'A';
    } else if (score >= 60) {
      tier = 'B';
    } else if (score >= 40) {
      tier = 'C';
    }

    return {
      score: Number(score.toFixed(2)),
      tier,
    };
  }
}