import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceVolatilityService {
  calculate(prices: number[]): number {
    const clean = prices.filter((value) => Number.isFinite(value) && value > 0);

    if (clean.length < 2) {
      return 0;
    }

    const avg = clean.reduce((sum, value) => sum + value, 0) / clean.length;

    if (avg <= 0) {
      return 0;
    }

    const variance =
      clean.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) /
      clean.length;

    const stdDev = Math.sqrt(variance);
    const coefficient = stdDev / avg;

    return Number(coefficient.toFixed(4));
  }
}