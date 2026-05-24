import { Job } from 'bullmq';
import { cleanupOldSnapshotsJob } from '../jobs/cleanup-old-snapshots.job';
import { detectDealsJob } from '../jobs/detect-deals.job';
import { markStaleListingsJob } from '../jobs/mark-stale-listings.job';
import { recomputeDecisionsJob } from '../jobs/recompute-decisions.job';
import { recomputeMarketSnapshotsJob } from '../jobs/recompute-market-snapshots.job';
import { runScannerJob } from '../jobs/run-scanner-job';
import { scheduledRefreshJob } from '../jobs/scheduled-refresh.job';
import { sourceHealthRollupJob } from '../jobs/source-health-rollup.job';
import { globalSyncRefreshJob } from '../jobs/global-sync-refresh.job';
import { portfolioRebalancingJob } from '../jobs/portfolio-rebalancing.job'; // <-- ДОДАНО ІМПОРТ
import { JOB_NAMES } from './queue.constants';

export async function routeJob(job: Job): Promise<unknown> {
  switch (job.name) {
    case JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS:
      return recomputeMarketSnapshotsJob();
    case JOB_NAMES.RECOMPUTE_DECISIONS:
      return recomputeDecisionsJob();
    case JOB_NAMES.DETECT_DEALS:
      return detectDealsJob();
    case JOB_NAMES.MARK_STALE_LISTINGS:
      return markStaleListingsJob();
    case JOB_NAMES.SOURCE_HEALTH_ROLLUP:
      return sourceHealthRollupJob();
    case JOB_NAMES.CLEANUP_OLD_SNAPSHOTS:
      return cleanupOldSnapshotsJob();
    case JOB_NAMES.SCHEDULED_REFRESH:
      return scheduledRefreshJob();
    case JOB_NAMES.RUN_SCANNER:
      if (!job.data?.jobId) throw new Error('RUN_SCANNER requires jobId');
      return runScannerJob(job.data.jobId);
    case JOB_NAMES.GLOBAL_SYNC_REFRESH:
      return globalSyncRefreshJob(job.data);
    case 'portfolio-rebalancing': // <-- Обробили нову задачу ребалансування капіталу
      return portfolioRebalancingJob();
    default:
      throw new Error(`Unknown job name: ${job.name}`);
  }
}