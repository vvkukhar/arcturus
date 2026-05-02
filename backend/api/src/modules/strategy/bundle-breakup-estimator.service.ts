import { Injectable } from '@nestjs/common';
import {
  addMoney,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';

export type BundleItem = {
  itemId: string;
  estimatedSell: number;
};

export type BundleBreakupInput = {
  bundlePrice: number;
  items: BundleItem[];
};

export type BundleBreakupResult = {
  totalResell: number;
  netAfterFees: number;
  roiPercent: number;
  recommendation: 'break_bundle' | 'keep_bundle' | 'avoid';
};

@Injectable()
export class BundleBreakupEstimatorService {
  estimate(input: BundleBreakupInput): BundleBreakupResult {
    const totalResell = addMoney(
      ...input.items.map((item) => item.estimatedSell),
    );

    const feeFactor = 0.12;
    const netAfterFees = toMoney(totalResell * (1 - feeFactor));
    const profit = toMoney(netAfterFees - input.bundlePrice);

    const roiPercent = calculateRoiPercent({
      profit,
      cost: input.bundlePrice,
    });

    let recommendation: BundleBreakupResult['recommendation'] = 'avoid';

    if (roiPercent >= 30) {
      recommendation = 'break_bundle';
    } else if (roiPercent >= 12) {
      recommendation = 'keep_bundle';
    }

    return {
      totalResell,
      netAfterFees,
      roiPercent,
      recommendation,
    };
  }
}