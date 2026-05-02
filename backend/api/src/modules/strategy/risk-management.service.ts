import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';

export type RiskManagementInput = {
  buyPrice: number;
  expectedNetProfit: number;
  roiPercent: number;
  liquidityScore: number;
  volatility: number;
  confidenceScore: number;
};

export type RiskManagementResult = {
  riskScore: number;
  riskTier: 'low' | 'medium' | 'high';
  maxPositionSize: number;
  stopBuyPrice: number;
  reason: string;
};

@Injectable()
export class RiskManagementService {
  evaluate(input: RiskManagementInput): RiskManagementResult {
    let riskScore = 50;

    riskScore -= input.roiPercent * 0.35;
    riskScore -= input.expectedNetProfit / 20;
    riskScore -= input.liquidityScore * 25;
    riskScore += input.volatility * 45;
    riskScore -= input.confidenceScore * 18;

    riskScore = Math.max(0, Math.min(100, riskScore));

    let riskTier: RiskManagementResult['riskTier'] = 'medium';
    let maxPositionSize = 0.2;
    let reason = 'Balanced exposure is recommended';

    if (riskScore < 35) {
      riskTier = 'low';
      maxPositionSize = 0.35;
      reason = 'Low risk profile allows larger position sizing';
    } else if (riskScore > 65) {
      riskTier = 'high';
      maxPositionSize = 0.12;
      reason = 'High risk profile requires smaller position sizing';
    }

    return {
      riskScore: Number(riskScore.toFixed(2)),
      riskTier,
      maxPositionSize,
      stopBuyPrice: toMoney(input.buyPrice * (1 + input.volatility * 0.3)),
      reason,
    };
  }
}