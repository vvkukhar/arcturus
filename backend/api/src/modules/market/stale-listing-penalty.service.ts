import { Injectable } from '@nestjs/common';

@Injectable()
export class StaleListingPenaltyService {
  apply(score: number, freshnessScore: number): number {
    const boundedScore = Math.max(0, Math.min(100, score));
    const boundedFreshness = Math.max(0, Math.min(1, freshnessScore));

    if (boundedFreshness >= 0.8) {
      return Number(boundedScore.toFixed(2));
    }

    if (boundedFreshness >= 0.5) {
      return Number((boundedScore * 0.9).toFixed(2));
    }

    if (boundedFreshness >= 0.25) {
      return Number((boundedScore * 0.75).toFixed(2));
    }

    return Number((boundedScore * 0.55).toFixed(2));
  }
}