import { prisma } from '../prisma';
import { recomputeMarketSnapshotsJob } from './recompute-market-snapshots.job';
import { recomputeDecisionsJob } from './recompute-decisions.job';
import { createRedisConnection } from '../queue/redis-connection';

const SYNC_STATE_KEY = 'sync:global_state';
const SYNC_CHANNEL = 'sync_events';

export async function globalSyncRefreshJob(
  payload: { totalItems?: number; itemId?: string; singleItem?: boolean }
): Promise<any> {
  
  if (payload.singleItem && payload.itemId) {
    return { success: true, type: 'single', itemId: payload.itemId, message: 'Handled by API' };
  }

  const redis = createRedisConnection();
  
  const publishEvent = async (event: string, eventPayload: any) => {
    await redis.publish(SYNC_CHANNEL, JSON.stringify({ event, payload: eventPayload }));
  };

  const updateState = async (updates: any) => {
    const currentData = await redis.get(SYNC_STATE_KEY);
    let state = currentData ? JSON.parse(currentData) : {};
    state = { ...state, ...updates };
    await redis.set(SYNC_STATE_KEY, JSON.stringify(state));
  };

  const totalItems = payload.totalItems ?? await prisma.item.count();
  
  await updateState({
    status: 'running',
    isRunning: true,
    startedAt: new Date().toISOString(),
    finishedAt: null,
    lastMode: 'global_refresh',
    processedItems: 0,
    totalItems,
    message: 'Refreshing all market snapshots',
    errorMessage: null,
  });

  await publishEvent('sync.started', { mode: 'global_refresh', totalItems });

  try {
    console.log('[GlobalSync] Starting global market snapshot recomputation...');
    const snapshotsResult = await recomputeMarketSnapshotsJob();
    
    await updateState({
      processedItems: Math.floor(totalItems / 2),
      message: `Recomputing decisions...`,
    });
    await publishEvent('sync.progress', { processedItems: Math.floor(totalItems / 2), totalItems });

    console.log('[GlobalSync] Starting global decisions recomputation...');
    const decisionsResult = await recomputeDecisionsJob();

    await updateState({
      status: 'finished',
      isRunning: false,
      finishedAt: new Date().toISOString(),
      processedItems: totalItems,
      message: 'Global refresh completed',
    });

    const finalPayload = {
      refreshedItems: snapshotsResult.snapshotsCreated,
      recomputedInventoryDecisions: decisionsResult.inventoryEvaluated,
      recomputedWatchlistDecisions: decisionsResult.listingsEvaluated,
    };

    await publishEvent('sync.finished', finalPayload);

    console.log('[GlobalSync] Finished successfully.', finalPayload);
    
    await redis.quit();
    return { success: true, type: 'global', ...finalPayload };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    await updateState({
      status: 'failed',
      isRunning: false,
      finishedAt: new Date().toISOString(),
      errorMessage,
    });

    await publishEvent('sync.failed', { error: errorMessage });
    console.error('[GlobalSync] Failed.', error);
    
    await redis.quit();
    throw error;
  }
}