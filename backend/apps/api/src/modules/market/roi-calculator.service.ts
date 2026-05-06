import { Injectable } from '@nestjs/common';
import { calculateRoiPercent } from '@arcturus/shared';

@Injectable()
export class RoiCalculatorService {
  calculate(costBasis: number, netProfit: number): number {
    return calculateRoiPercent({
      cost: costBasis,
      profit: netProfit,
    });
  }
}