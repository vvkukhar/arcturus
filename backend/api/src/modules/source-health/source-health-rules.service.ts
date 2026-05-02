import { Injectable } from '@nestjs/common';

@Injectable()
export class SourceHealthRulesService {
  resolveHealthStatus(params: {
    enabled: boolean;
    freshnessLabel: string;
    latestRunStatus: string;
    latestErrorMessage?: string | null;
  }): 'healthy' | 'warning' | 'critical' | 'disabled' {
    if (!params.enabled) return 'disabled';

    if (params.latestErrorMessage) return 'critical';

    if (
      params.latestRunStatus === 'failed' ||
      params.freshnessLabel === 'missing' ||
      params.freshnessLabel === 'very_stale'
    ) {
      return 'critical';
    }

    if (
      params.freshnessLabel === 'aging' ||
      params.freshnessLabel === 'stale'
    ) {
      return 'warning';
    }

    return 'healthy';
  }
}