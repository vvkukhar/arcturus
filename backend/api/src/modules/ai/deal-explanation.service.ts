import { Injectable } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';

@Injectable()
export class DealExplanationService {
  explain(input: {
    buyPrice: number;
    sellPrice: number;
    marketFloor?: number | null;
    marketAverage?: number | null;
    liquidityScore?: number | null;
  }): {
    verdict: string;
    roi: number;
    profit: number;
    reasons: string[];
    risks: string[];
    recommendation: 'buy' | 'watch' | 'skip';
  } {
    const buyPrice = toMoney(input.buyPrice ?? 0);
    const sellPrice = toMoney(input.sellPrice ?? 0);

    const profit = calculateProfit({
      revenue: sellPrice,
      cost: buyPrice,
    });

    const roi = calculateRoiPercent({
      profit,
      cost: buyPrice,
    });

    const reasons: string[] = [];
    const risks: string[] = [];

    if (roi >= 50) {
      reasons.push('ROI is very strong for a fast LEGO flip.');
    } else if (roi >= 30) {
      reasons.push('ROI is healthy and can justify execution.');
    } else if (roi >= 15) {
      reasons.push('ROI is workable but not exceptional.');
    } else {
      risks.push('ROI is too thin unless turnover is very fast.');
    }

    if (profit >= 300) {
      reasons.push('Absolute profit is strong enough to matter.');
    } else if (profit >= 120) {
      reasons.push('Profit is acceptable for small-ticket rotation.');
    } else {
      risks.push('Absolute profit may not justify time, packaging and negotiation.');
    }

    if (
      input.marketFloor != null &&
      Number.isFinite(input.marketFloor) &&
      sellPrice <= input.marketFloor
    ) {
      reasons.push('Sell price is close to market floor, which supports faster exit.');
    }

    if (
      input.marketAverage != null &&
      Number.isFinite(input.marketAverage) &&
      sellPrice > input.marketAverage * 1.15
    ) {
      risks.push('Sell price is significantly above average, so hold time may increase.');
    }

    if (
      input.liquidityScore != null &&
      Number.isFinite(input.liquidityScore)
    ) {
      if (input.liquidityScore >= 70) {
        reasons.push('Liquidity score supports faster capital recycling.');
      } else if (input.liquidityScore < 40) {
        risks.push('Low liquidity means capital may freeze in inventory.');
      }
    }

    let recommendation: 'buy' | 'watch' | 'skip' = 'watch';

    if (roi >= 30 && profit >= 120 && risks.length <= 1) {
      recommendation = 'buy';
    } else if (roi < 12 || profit < 50) {
      recommendation = 'skip';
    }

    const verdict =
      recommendation === 'buy'
        ? 'Good deal profile'
        : recommendation === 'watch'
          ? 'Watch or negotiate'
          : 'Skip for now';

    return {
      verdict,
      roi,
      profit,
      reasons,
      risks,
      recommendation,
    };
  }
}