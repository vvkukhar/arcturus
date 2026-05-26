import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from './queue.constants';
import { createRedisConnection } from './redis-connection';

export async function registerRepeatableJobs(): Promise<void> {
  const connection = createRedisConnection();

  const marketQueue = new Queue(QUEUE_NAMES.MARKET, { connection });
  const decisionsQueue = new Queue(QUEUE_NAMES.DECISIONS, { connection });
  const maintenanceQueue = new Queue(QUEUE_NAMES.MAINTENANCE, { connection });

  await marketQueue.add(JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS, {}, { repeat: { every: 1000 * 60 * 30 }, jobId: 'rep:market:snaps', removeOnComplete: 10, removeOnFail: 20 });
  await decisionsQueue.add(JOB_NAMES.RECOMPUTE_DECISIONS, {}, { repeat: { every: 1000 * 60 * 35 }, jobId: 'rep:decisions:recomp', removeOnComplete: 10, removeOnFail: 20 });
  await decisionsQueue.add(JOB_NAMES.DETECT_DEALS, {}, { repeat: { every: 1000 * 60 * 20 }, jobId: 'rep:deals:detect', removeOnComplete: 10, removeOnFail: 20 });
  
  await maintenanceQueue.add(JOB_NAMES.SCHEDULED_REFRESH, {}, { repeat: { every: 1000 * 60 * 60 }, jobId: 'rep:maint:refresh', removeOnComplete: 10, removeOnFail: 20 });
  await maintenanceQueue.add(JOB_NAMES.MARK_STALE_LISTINGS, {}, { repeat: { every: 1000 * 60 * 60 * 2 }, jobId: 'rep:maint:stale', removeOnComplete: 10, removeOnFail: 20 });
  
  await maintenanceQueue.add(JOB_NAMES.PORTFOLIO_REBALANCING, {}, { repeat: { every: 1000 * 60 * 60 * 12 }, jobId: 'rep:maint:port_rebal', removeOnComplete: 5, removeOnFail: 10 });
  await maintenanceQueue.add(JOB_NAMES.C2C_STORAGE_FEE, {}, { repeat: { every: 1000 * 60 * 60 * 24 }, jobId: 'rep:maint:c2c_fee', removeOnComplete: 5, removeOnFail: 10 });
  await maintenanceQueue.add(JOB_NAMES.DUTCH_AUCTION, {}, { repeat: { every: 1000 * 60 * 60 * 24 }, jobId: 'rep:maint:dutch_auc', removeOnComplete: 5, removeOnFail: 10 });
  await maintenanceQueue.add(JOB_NAMES.LOGISTICS_SENTINEL, {}, { repeat: { every: 1000 * 60 * 60 * 12 }, jobId: 'rep:maint:logistics', removeOnComplete: 5, removeOnFail: 10 });
  
  await decisionsQueue.add(JOB_NAMES.MONOPOLY_SQUEEZE, {}, { repeat: { every: 1000 * 60 * 60 * 6 }, jobId: 'rep:decisions:monopoly', removeOnComplete: 5, removeOnFail: 10 });
  await decisionsQueue.add(JOB_NAMES.ZERO_TOUCH_MATCHER, {}, { repeat: { every: 1000 * 60 * 60 * 2 }, jobId: 'rep:decisions:zerotouch', removeOnComplete: 5, removeOnFail: 10 });
  await decisionsQueue.add(JOB_NAMES.SURGE_SCOUTS, {}, { repeat: { every: 1000 * 60 * 60 * 4 }, jobId: 'rep:decisions:surge_scouts', removeOnComplete: 5, removeOnFail: 10 });

  await maintenanceQueue.add(JOB_NAMES.AI_SMM_BROADCASTER, {}, { repeat: { every: 1000 * 60 * 60 * 4 }, jobId: 'rep:maint:smm', removeOnComplete: 5, removeOnFail: 10 });
  await maintenanceQueue.add(JOB_NAMES.LTV_MAXIMIZER, {}, { repeat: { every: 1000 * 60 * 60 * 24 }, jobId: 'rep:maint:ltv', removeOnComplete: 5, removeOnFail: 10 });

  await connection.quit();
}