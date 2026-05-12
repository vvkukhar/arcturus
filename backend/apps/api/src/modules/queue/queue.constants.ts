export const QUEUE_NAMES = {
  MARKET: 'market',
  DECISIONS: 'decisions',
  SCRAPER: 'scraper',
  MAINTENANCE: 'maintenance',
  SYNC: 'sync',
} as const;

export const JOB_NAMES = {
  RECOMPUTE_MARKET_SNAPSHOTS: 'recompute_market_snapshots',
  RECOMPUTE_DECISIONS: 'recompute_decisions',
  DETECT_DEALS: 'detect_deals',
  MARK_STALE_LISTINGS: 'mark_stale_listings',
  SOURCE_HEALTH_ROLLUP: 'source_health_rollup',
  CLEANUP_OLD_SNAPSHOTS: 'cleanup_old_snapshots',
  SCHEDULED_REFRESH: 'scheduled_refresh',
  RUN_SCANNER_JOB: 'run_scanner_job',
  GLOBAL_SYNC_REFRESH: 'global_sync_refresh',
} as const;