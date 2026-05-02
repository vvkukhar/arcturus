import { Injectable } from '@nestjs/common';

export type MarketAnomalyInput = {
  price: number;
  medianPrice: number;
  lowestPrice: number;
};

export type MarketAnomalyResult = {
  isAnomaly: boolean;
  label: string;
  score: number;
};

@Injectable()
export class MarketAnomalyService {
  detect(input: MarketAnomalyInput): MarketAnomalyResult {
    if (input.medianPrice <= 0) {
      return {
        isAnomaly: false,
        label: 'insufficient baseline',
        score: 0,
      };
    }

    const deviation = ((input.medianPrice - input.price) / input.medianPrice) * 100;

    if (deviation >= 45) {
      return {
        isAnomaly: true,
        label: 'extreme under-market listing',
        score: 95,
      };
    }

    if (deviation >= 25) {
      return {
        isAnomaly: true,
        label: 'strong under-market listing',
        score: 75,
      };
    }

    if (input.price < input.lowestPrice) {
      return {
        isAnomaly: true,
        label: 'new lowest listing',
        score: 60,
      };
    }

    return {
      isAnomaly: false,
      label: 'normal market behavior',
      score: 20,
    };
  }
}