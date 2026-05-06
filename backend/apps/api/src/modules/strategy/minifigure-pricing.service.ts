import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';

export type MinifigurePricingInput = {
  medianPrice: number;
  lowestPrice: number;
  soldCount: number;
  volatility: number;
};

export type MinifigurePricingResult = {
  quickSellPrice: number;
  marketPrice: number;
  premiumPrice: number;
};

@Injectable()
export class MinifigurePricingService {
  suggest(input: MinifigurePricingInput): MinifigurePricingResult {
    let quickSell = input.lowestPrice;
    let market = input.medianPrice;
    let premium = input.medianPrice * 1.12;

    if (input.soldCount >= 8) {
      quickSell = input.lowestPrice + 10;
      market = input.medianPrice;
      premium = input.medianPrice * 1.18;
    }

    if (input.volatility >= 0.4) {
      quickSell *= 0.95;
      premium *= 0.95;
    }

    return {
      quickSellPrice: toMoney(quickSell),
      marketPrice: toMoney(market),
      premiumPrice: toMoney(premium),
    };
  }
}