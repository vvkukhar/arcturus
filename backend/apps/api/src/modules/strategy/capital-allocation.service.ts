import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';

export type CapitalAllocationCandidate = {
  itemId: string;
  title: string;
  buyPrice: number;
  expectedNetProfit: number;
  roiPercent: number;
  liquidityScore: number;
  confidenceScore: number;
  strategy: string;
};

export type CapitalAllocationResult = {
  itemId: string;
  title: string;
  allocation: number;
  units: number;
  reservedCapital: number;
  priorityScore: number;
  strategy: string;
};

@Injectable()
export class CapitalAllocationService {
  allocate(
    capital: number,
    candidates: CapitalAllocationCandidate[],
  ): CapitalAllocationResult[] {
    if (!Number.isFinite(capital) || capital <= 0 || candidates.length === 0) {
      return [];
    }

    const scored = candidates
      .filter((candidate) => Number.isFinite(candidate.buyPrice) && candidate.buyPrice > 0)
      .map((candidate) => {
        const priorityScore =
          candidate.expectedNetProfit * 0.35 +
          candidate.roiPercent * 0.25 +
          candidate.liquidityScore * 20 +
          candidate.confidenceScore * 20;

        return {
          ...candidate,
          priorityScore: Number(priorityScore.toFixed(2)),
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore);

    let remaining = toMoney(capital);
    const output: CapitalAllocationResult[] = [];

    for (const candidate of scored) {
      if (remaining < candidate.buyPrice) {
        continue;
      }

      const maxShare =
        candidate.strategy === 'quick_flip'
          ? 0.35
          : candidate.strategy === 'hold_flip'
            ? 0.25
            : 0.2;

      const bucket = Math.min(remaining, capital * maxShare);
      const units = Math.max(1, Math.floor(bucket / candidate.buyPrice));
      const reservedCapital = toMoney(units * candidate.buyPrice);

      if (units <= 0 || reservedCapital > remaining) {
        continue;
      }

      output.push({
        itemId: candidate.itemId,
        title: candidate.title,
        allocation: Number((reservedCapital / capital).toFixed(4)),
        units,
        reservedCapital,
        priorityScore: candidate.priorityScore,
        strategy: candidate.strategy,
      });

      remaining = toMoney(remaining - reservedCapital);

      if (remaining <= 0) {
        break;
      }
    }

    return output;
  }
}