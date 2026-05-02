import { cleanupOldSnapshotsJob } from './cleanup-old-snapshots.job';
import { markStaleListingsJob } from './mark-stale-listings.job';
import { recomputeDecisionsJob } from './recompute-decisions.job';
import { recomputeMarketSnapshotsJob } from './recompute-market-snapshots.job';
import { sourceHealthRollupJob } from './source-health-rollup.job';
import { prisma } from '../prisma';

export async function scheduledRefreshJob(): Promise<{
  skipped: boolean;
  snapshots?: {
    totalItems: number;
    snapshotsCreated: number;
  };
  decisions?: {
    inventoryDecisions: number;
    watchlistDecisions: number;
  };
  stale?: {
    markedStale: number;
  };
  health?: {
    sourcesChecked: number;
    errorsCreated: number;
  };
  cleanup?: {
    deletedSnapshots: number;
    deletedDecisions: number;
  };
}> {
  const activeItems = await prisma.item.count();

  if (activeItems === 0) {
    return {
      skipped: true,
    };
  }

  const stale = await markStaleListingsJob();
  const snapshots = await recomputeMarketSnapshotsJob();
  const decisions = await recomputeDecisionsJob();
  const health = await sourceHealthRollupJob();
  const cleanup = await cleanupOldSnapshotsJob({
    keepPerItem: 40,
  });

  return {
    skipped: false,
    snapshots,
    decisions,
    stale,
    health,
    cleanup,
  };
}