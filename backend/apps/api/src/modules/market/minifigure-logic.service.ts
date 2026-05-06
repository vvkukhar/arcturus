import { Injectable } from '@nestjs/common';

export type MinifigureAdjustmentInput = {
  baseScore: number;
  isRare: boolean;
  soldCount: number;
  priceVolatility: number;
};

@Injectable()
export class MinifigureLogicService {
  adjust(input: MinifigureAdjustmentInput): number {
    let score = input.baseScore;

    if (input.isRare) {
      score += 8;
    }

    if (input.soldCount >= 8) {
      score += 7;
    } else if (input.soldCount >= 3) {
      score += 4;
    }

    if (input.priceVolatility <= 0.25) {
      score += 5;
    } else if (input.priceVolatility >= 0.5) {
      score -= 8;
    }

    return Number(Math.max(0, Math.min(100, score)).toFixed(2));
  }
}