import { Injectable } from '@nestjs/common';

export type SourceFreshnessResult = {
  freshnessScore: number;
  label: 'fresh' | 'recent' | 'aging' | 'stale' | 'very_stale';
  ageHours: number;
};

@Injectable()
export class SourceFreshnessService {
  evaluate(date: Date): SourceFreshnessResult {
    const ageHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

    if (ageHours <= 6) {
      return {
        freshnessScore: 1,
        label: 'fresh',
        ageHours: Number(ageHours.toFixed(2)),
      };
    }

    if (ageHours <= 24) {
      return {
        freshnessScore: 0.82,
        label: 'recent',
        ageHours: Number(ageHours.toFixed(2)),
      };
    }

    if (ageHours <= 72) {
      return {
        freshnessScore: 0.55,
        label: 'aging',
        ageHours: Number(ageHours.toFixed(2)),
      };
    }

    if (ageHours <= 168) {
      return {
        freshnessScore: 0.3,
        label: 'stale',
        ageHours: Number(ageHours.toFixed(2)),
      };
    }

    return {
      freshnessScore: 0.12,
      label: 'very_stale',
      ageHours: Number(ageHours.toFixed(2)),
    };
  }
}