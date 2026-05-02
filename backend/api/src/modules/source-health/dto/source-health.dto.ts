export type SourceFreshnessLabel =
  | 'missing'
  | 'fresh'
  | 'recent'
  | 'aging'
  | 'stale'
  | 'very_stale';

export type SourceHealthStatus =
  | 'healthy'
  | 'warning'
  | 'critical'
  | 'disabled';

export type SourceHealthView = {
  sourceCode: string;
  sourceName: string;
  enabled: boolean;
  listingCount: number;
  latestRunStatus: string;
  freshnessLabel: SourceFreshnessLabel | string;
  healthStatus: SourceHealthStatus;
  latestErrorMessage: string | null;
};