import { Injectable } from '@nestjs/common';
import {
  addMoney,
  calculateRoiPercent,
  toMoney,
} from '@arcturus/shared';

export type PartOutComponent = {
  name: string;
  estimatedPrice: number;
  liquidity: number;
};

export type PartOutInput = {
  itemId: string;
  components: PartOutComponent[];
  buyPrice: number;
};

export type PartOutResult = {
  totalEstimatedValue: number;
  netAfterFees: number;
  roiPercent: number;
  liquidityScore: number;
  recommendation: 'strong_part_out' | 'moderate_part_out' | 'avoid';
};

@Injectable()
export class PartOutEstimatorService {
  estimate(input: PartOutInput): PartOutResult {
    const totalEstimatedValue = addMoney(
      ...input.components.map((component) => component.estimatedPrice),
    );

    const avgLiquidity =
      input.components.length > 0
        ? input.components.reduce(
            (sum, component) => sum + component.liquidity,
            0,
          ) / input.components.length
        : 0;

    const feeFactor = 0.13;
    const netAfterFees = toMoney(totalEstimatedValue * (1 - feeFactor));

    const profit = toMoney(netAfterFees - input.buyPrice);

    const roiPercent = calculateRoiPercent({
      profit,
      cost: input.buyPrice,
    });

    let recommendation: PartOutResult['recommendation'] = 'avoid';

    if (roiPercent >= 35 && avgLiquidity >= 0.6) {
      recommendation = 'strong_part_out';
    } else if (roiPercent >= 18 && avgLiquidity >= 0.4) {
      recommendation = 'moderate_part_out';
    }

    return {
      totalEstimatedValue,
      netAfterFees,
      roiPercent,
      liquidityScore: Number(avgLiquidity.toFixed(2)),
      recommendation,
    };
  }
}