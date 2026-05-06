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
  scoreBuy(input: OpportunityScoreV3Input): number {
    let score = 0;

    if (input.spread >= 400) score += 20;
    else if (input.spread >= 250) score += 14;
    else if (input.spread >= 120) score += 8;

    if (input.netProfit >= 300) score += 22;
    else if (input.netProfit >= 200) score += 16;
    else if (input.netProfit >= 100) score += 8;

    if (input.roiPercent >= 35) score += 18;
    else if (input.roiPercent >= 20) score += 12;
    else if (input.roiPercent >= 10) score += 6;

    score += input.sourceWeight * 10;
    score += input.snapshotConfidence * 12;
    score += (input.anomalyScore / 100) * 12;

    if (input.soldCount >= 8) score += 6;
    else if (input.soldCount >= 3) score += 3;

    if (score > 100) return 100;
    return Number(score.toFixed(2));
  }

  scoreSell(input: OpportunityScoreV3Input): number {
    let score = 0;

    if (input.netProfit >= 300) score += 24;
    else if (input.netProfit >= 200) score += 18;
    else if (input.netProfit >= 100) score += 10;

    if (input.roiPercent >= 30) score += 18;
    else if (input.roiPercent >= 20) score += 12;
    else if (input.roiPercent >= 10) score += 6;

    if (input.spread >= 200) score += 14;
    else if (input.spread >= 100) score += 8;

    score += input.sourceWeight * 8;
    score += input.snapshotConfidence * 14;

    if (input.soldCount >= 8) score += 10;
    else if (input.soldCount >= 3) score += 5;

    if (score > 100) return 100;
    return Number(score.toFixed(2));
  }
}