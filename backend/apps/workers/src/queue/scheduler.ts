import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from './queue.constants';
import { createRedisConnection } from './redis-connection';

export async function registerRepeatableJobs(): Promise<void> {
  const connection = createRedisConnection();

  const marketQueue = new Queue(QUEUE_NAMES.MARKET, { connection });
  const decisionsQueue = new Queue(QUEUE_NAMES.DECISIONS, { connection });
  const maintenanceQueue = new Queue(QUEUE_NAMES.MAINTENANCE, { connection });

  // Всі джоби тепер швидко видаляються з Redis, не забиваючи пам'ять
  await marketQueue.add(
    JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS,
    {},
    {
      repeat: { every: 1000 * 60 * 30 },
      jobId: 'repeat:market:snapshots',
      removeOnComplete: 10,
      removeOnFail: 20,
    },
  );

  await decisionsQueue.add(
    JOB_NAMES.RECOMPUTE_DECISIONS,
    {},
    {
      repeat: { every: 1000 * 60 * 35 },
      jobId: 'repeat:decisions:recompute',
      removeOnComplete: 10,
      removeOnFail: 20,
    },
  );

  await decisionsQueue.add(
    JOB_NAMES.DETECT_DEALS,
    {},
    {
      repeat: { every: 1000 * 60 * 20 },
      jobId: 'repeat:deals:detect',
      removeOnComplete: 10,
      removeOnFail: 20,
    },
  );

  await maintenanceQueue.add(
    JOB_NAMES.SCHEDULED_REFRESH,
    {},
    {
      repeat: { every: 1000 * 60 * 60 },
      jobId: 'repeat:maintenance:scheduled-refresh',
      removeOnComplete: 10,
      removeOnFail: 20,
    },
  );

  await maintenanceQueue.add(
    JOB_NAMES.MARK_STALE_LISTINGS,
    {},
    {
      repeat: { every: 1000 * 60 * 60 * 2 },
      jobId: 'repeat:maintenance:stale-listings',
      removeOnComplete: 10,
      removeOnFail: 20,
    },
  );

  console.log('[scheduler] repeatable jobs registered (Memory Optimized)');
  await connection.quit();
}