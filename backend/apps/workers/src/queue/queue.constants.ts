export const QUEUE_NAMES = {
  SCRAPERS: 'scrapers',
  MARKET: 'market',
  DECISIONS: 'decisions',
  MAINTENANCE: 'maintenance',
} as const;

export const JOB_NAMES = {
  RUN_SCANNER: 'run-scanner',
  RECOMPUTE_MARKET_SNAPSHOTS: 'recompute-market-snapshots',
  RECOMPUTE_DECISIONS: 'recompute-decisions',
  DETECT_DEALS: 'detect-deals',
  SCHEDULED_REFRESH: 'scheduled-refresh',
  MARK_STALE_LISTINGS: 'mark-stale-listings',
} as const;