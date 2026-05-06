import { Injectable } from '@nestjs/common';
import {
  addMoney,
  calculateMarginPercent,
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '@arcturus/shared';

export type MarginCalculationInput = {
  buyPrice: number;
  extraCosts: number;
  shippingCost: number;
  packagingCost: number;
  salePrice: number;
  platformFeeRate: number;
  paymentFeeRate: number;
};

export type MarginCalculationResult = {
  totalCostBasis: number;
  grossSale: number;
  platformFees: number;
  paymentFees: number;
  totalFees: number;
  netSale: number;
  netProfit: number;
  marginPercent: number;
  roiPercent: number;
};

@Injectable()
export class MarginCalculationService {
  calculate(input: MarginCalculationInput): MarginCalculationResult {
    const totalCostBasis = addMoney(
      input.buyPrice,
      input.extraCosts,
      input.shippingCost,
      input.packagingCost,
    );

    const grossSale = toMoney(input.salePrice);
    const platformFees = toMoney(input.salePrice * input.platformFeeRate);
    const paymentFees = toMoney(input.salePrice * input.paymentFeeRate);
    const totalFees = addMoney(platformFees, paymentFees);
    const netSale = toMoney(grossSale - totalFees);

    const netProfit = calculateProfit({
      revenue: netSale,
      cost: totalCostBasis,
    });

    const marginPercent = calculateMarginPercent({
      profit: netProfit,
      revenue: grossSale,
    });

    const roiPercent = calculateRoiPercent({
      profit: netProfit,
      cost: totalCostBasis,
    });

    return {
      totalCostBasis,
      grossSale,
      platformFees,
      paymentFees,
      totalFees,
      netSale,
      netProfit,
      marginPercent,
      roiPercent,
    };
  }
}