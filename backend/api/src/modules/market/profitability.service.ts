import { Injectable } from '@nestjs/common';
import {
  addMoney,
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';

export type ProfitabilityInput = {
  buyPrice: number;
  shippingCost: number;
  platformFeeRate: number;
  paymentFeeRate: number;
  packagingCost: number;
  targetSellPrice: number;
};

export type ProfitabilityResult = {
  totalEntryCost: number;
  grossRevenue: number;
  totalFees: number;
  netRevenue: number;
  netProfit: number;
  roiPercent: number;
};

@Injectable()
export class ProfitabilityService {
  calculate(input: ProfitabilityInput): ProfitabilityResult {
    const totalEntryCost = addMoney(
      input.buyPrice,
      input.shippingCost,
      input.packagingCost,
    );

    const grossRevenue = toMoney(input.targetSellPrice);

    const platformFee = input.targetSellPrice * input.platformFeeRate;
    const paymentFee = input.targetSellPrice * input.paymentFeeRate;
    const totalFees = addMoney(platformFee, paymentFee);

    const netRevenue = toMoney(grossRevenue - totalFees);

    const netProfit = calculateProfit({
      revenue: netRevenue,
      cost: totalEntryCost,
    });

    const roiPercent = calculateRoiPercent({
      profit: netProfit,
      cost: totalEntryCost,
    });

    return {
      totalEntryCost,
      grossRevenue,
      totalFees,
      netRevenue,
      netProfit,
      roiPercent,
    };
  }
}