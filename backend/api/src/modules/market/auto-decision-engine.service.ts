import { Injectable } from '@nestjs/common';

export type AutoBuyDecisionInput = {
  buyScore: number;
  netProfit: number;
  roiPercent: number;
  freshnessScore: number;
  confidenceScore: number;
};

export type AutoSellDecisionInput = {
  sellScore: number;
  netProfit: number;
  roiPercent: number;
  confidenceScore: number;
};

export type AutoDecisionResult = {
  action: string;
  score: number;
  reasonPrimary: string;
  reasonSecondary: string;
};

@Injectable()
export class AutoDecisionEngineService {
  decideBuy(input: AutoBuyDecisionInput): AutoDecisionResult {
    if (
      input.buyScore >= 82 &&
      input.netProfit >= 180 &&
      input.roiPercent >= 18 &&
      input.freshnessScore >= 0.6 &&
      input.confidenceScore >= 0.55
    ) {
      return {
        action: 'buy_now',
        score: input.buyScore,
        reasonPrimary: 'High-confidence buy opportunity',
        reasonSecondary: 'Profit, ROI and freshness are aligned',
      };
    }
    if (
      input.buyScore >= 68 &&
      input.netProfit >= 100 &&
      input.roiPercent >= 10
    ) {
      return {
        action: 'queue_for_buy',
        score: input.buyScore,
        reasonPrimary: 'Good buy candidate',
        reasonSecondary: 'Worth monitoring or adding to purchase flow',
      };
    }
    return {
      action: 'wait',
      score: input.buyScore,
      reasonPrimary: 'Conditions are not strong enough yet',
      reasonSecondary: 'Wait for better pricing or stronger confidence',
    };
  }

  decideSell(input: AutoSellDecisionInput): AutoDecisionResult {
    if (
      input.sellScore >= 78 &&
      input.netProfit >= 180 &&
      input.roiPercent >= 15 &&
      input.confidenceScore >= 0.55
    ) {
      return {
        action: 'sell_now',
        score: input.sellScore,
        reasonPrimary: 'Profitable sell window is open',
        reasonSecondary: 'Market confidence and return profile are strong',
      };
    }
    if (
      input.sellScore >= 60 &&
      input.netProfit >= 80
    ) {
      return {
        action: 'prepare_sale',
        score: input.sellScore,
        reasonPrimary: 'Reasonable sell candidate',
        reasonSecondary: 'Sale is viable but not urgent',
      };
    }
    return {
      action: 'hold',
      score: input.sellScore,
      reasonPrimary: 'Hold position',
      reasonSecondary: 'Return profile is not strong enough for exit yet',
    };
  }
}