export const QUEUE_NAMES = {
  MARKET: 'market',
  DECISIONS: 'decisions',
  SCRAPER: 'scrapers',
  MAINTENANCE: 'maintenance',
  SYNC: 'sync',
} as const;

export const JOB_NAMES = {
  RECOMPUTE_MARKET_SNAPSHOTS: 'recompute-market-snapshots',
  RECOMPUTE_DECISIONS: 'recompute-decisions',
  DETECT_DEALS: 'detect-deals',
  MARK_STALE_LISTINGS: 'mark-stale-listings',
  SOURCE_HEALTH_ROLLUP: 'source-health-rollup',
  CLEANUP_OLD_SNAPSHOTS: 'cleanup-old-snapshots',
  SCHEDULED_REFRESH: 'scheduled-refresh',
  RUN_SCANNER_JOB: 'run-scanner',
  GLOBAL_SYNC_REFRESH: 'global-sync-refresh',
  SURGE_PRICING: 'surge-pricing',
} as const;