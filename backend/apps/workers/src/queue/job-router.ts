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
import { portfolioRebalancingJob } from '../jobs/portfolio-rebalancing.job';
import { c2cStorageFeeJob } from '../jobs/c2c-storage-fee.job';
import { dutchAuctionJob } from '../jobs/dutch-auction.job';
import { surgePricingJob } from '../jobs/surge-pricing.job';
import { logisticsSentinelJob } from '../jobs/logistics-sentinel.job';
import { monopolySqueezeJob } from '../jobs/monopoly-squeeze.job';
import { zeroTouchMatcherJob } from '../jobs/zero-touch-matcher.job';
import { aiSmmBroadcasterJob } from '../jobs/ai-smm-broadcaster.job';
import { ltvMaximizerJob } from '../jobs/ltv-maximizer.job';
import { surgeScoutsJob } from '../jobs/surge-scouts.job';
import { vaultReportsJob } from '../jobs/vault-reports.job';
import { JOB_NAMES } from './queue.constants';

export async function routeJob(job: Job): Promise<unknown> {
  switch (job.name) {
    case JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS: return recomputeMarketSnapshotsJob();
    case JOB_NAMES.RECOMPUTE_DECISIONS: return recomputeDecisionsJob();
    case JOB_NAMES.DETECT_DEALS: return detectDealsJob();
    case JOB_NAMES.MARK_STALE_LISTINGS: return markStaleListingsJob();
    case JOB_NAMES.SOURCE_HEALTH_ROLLUP: return sourceHealthRollupJob();
    case JOB_NAMES.CLEANUP_OLD_SNAPSHOTS: return cleanupOldSnapshotsJob();
    case JOB_NAMES.SCHEDULED_REFRESH: return scheduledRefreshJob();
    case JOB_NAMES.RUN_SCANNER:
      if (!job.data?.jobId) throw new Error('RUN_SCANNER requires jobId');
      return runScannerJob(job.data.jobId);
    case JOB_NAMES.GLOBAL_SYNC_REFRESH: return globalSyncRefreshJob(job.data);
    case JOB_NAMES.PORTFOLIO_REBALANCING: return portfolioRebalancingJob();
    case JOB_NAMES.C2C_STORAGE_FEE: return c2cStorageFeeJob();
    case JOB_NAMES.DUTCH_AUCTION: return dutchAuctionJob();
    case JOB_NAMES.SURGE_PRICING: return surgePricingJob(new Map(job.data?.activeSessions || []));
    case JOB_NAMES.LOGISTICS_SENTINEL: return logisticsSentinelJob();
    case JOB_NAMES.MONOPOLY_SQUEEZE: return monopolySqueezeJob();
    case JOB_NAMES.ZERO_TOUCH_MATCHER: return zeroTouchMatcherJob();
    case JOB_NAMES.AI_SMM_BROADCASTER: return aiSmmBroadcasterJob();
    case JOB_NAMES.LTV_MAXIMIZER: return ltvMaximizerJob();
    case JOB_NAMES.SURGE_SCOUTS: return surgeScoutsJob();
    case JOB_NAMES.VAULT_REPORTS: return vaultReportsJob();
    default: throw new Error(`Unknown job name: ${job.name}`);
  }
}