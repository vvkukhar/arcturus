import { Injectable } from '@nestjs/common';

export type OpportunityScoreV3Input = {
  spread: number;
  netProfit: number;
  roiPercent: number;
  sourceWeight: number;
  snapshotConfidence: number;
  anomalyScore: number;
  soldCount: number;
};

@Injectable()
export class OpportunityScoreV3Service {
  private readonly BUY_WEIGHTS = {
    spread: [
      { threshold: 400, score: 20 },
      { threshold: 250, score: 14 },
      { threshold: 120, score: 8 },
    ],
    profit: [
      { threshold: 300, score: 22 },
      { threshold: 200, score: 16 },
      { threshold: 100, score: 8 },
    ],
    roi: [
      { threshold: 35, score: 18 },
      { threshold: 20, score: 12 },
      { threshold: 10, score: 6 },
    ],
    sold: [
      { threshold: 8, score: 6 },
      { threshold: 3, score: 3 },
    ],
    multipliers: {
      source: 10,
      confidence: 12,
      anomaly: 0.12,
    }
  };

  private readonly SELL_WEIGHTS = {
    profit: [
      { threshold: 300, score: 24 },
      { threshold: 200, score: 18 },
      { threshold: 100, score: 10 },
    ],
    roi: [
      { threshold: 30, score: 18 },
      { threshold: 20, score: 12 },
      { threshold: 10, score: 6 },
    ],
    spread: [
      { threshold: 200, score: 14 },
      { threshold: 100, score: 8 },
    ],
    sold: [
      { threshold: 8, score: 10 },
      { threshold: 3, score: 5 },
    ],
    multipliers: {
      source: 8,
      confidence: 14,
    }
  };

  private calculateTierScore(value: number, tiers: { threshold: number, score: number }[]): number {
    for (const tier of tiers) {
      if (value >= tier.threshold) return tier.score;
    }
    return 0;
  }

  scoreBuy(input: OpportunityScoreV3Input): number {
    let score = 0;
    score += this.calculateTierScore(input.spread, this.BUY_WEIGHTS.spread);
    score += this.calculateTierScore(input.netProfit, this.BUY_WEIGHTS.profit);
    score += this.calculateTierScore(input.roiPercent, this.BUY_WEIGHTS.roi);
    score += this.calculateTierScore(input.soldCount, this.BUY_WEIGHTS.sold);
    score += input.sourceWeight * this.BUY_WEIGHTS.multipliers.source;
    score += input.snapshotConfidence * this.BUY_WEIGHTS.multipliers.confidence;
    score += input.anomalyScore * this.BUY_WEIGHTS.multipliers.anomaly;
    return Number(Math.min(100, Math.max(0, score)).toFixed(2));
  }

  scoreSell(input: OpportunityScoreV3Input): number {
    let score = 0;
    score += this.calculateTierScore(input.netProfit, this.SELL_WEIGHTS.profit);
    score += this.calculateTierScore(input.roiPercent, this.SELL_WEIGHTS.roi);
    score += this.calculateTierScore(input.spread, this.SELL_WEIGHTS.spread);
    score += this.calculateTierScore(input.soldCount, this.SELL_WEIGHTS.sold);
    score += input.sourceWeight * this.SELL_WEIGHTS.multipliers.source;
    score += input.snapshotConfidence * this.SELL_WEIGHTS.multipliers.confidence;
    return Number(Math.min(100, Math.max(0, score)).toFixed(2));
  }
}