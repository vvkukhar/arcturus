import 'dotenv/config';
import { Queue } from 'bullmq';
import { JOB_NAMES, QUEUE_NAMES } from './queue/queue.constants';
import { createRedisConnection } from './queue/redis-connection';

async function main(): Promise<void> {
  const jobName = process.argv[2];

  if (!jobName) {
    throw new Error(
      `Usage: ts-node src/manual-run.ts ${Object.values(JOB_NAMES).join('|')}`,
    );
  }

  const queueName =
    jobName === JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS
      ? QUEUE_NAMES.MARKET
      : jobName === JOB_NAMES.RECOMPUTE_DECISIONS ||
          jobName === JOB_NAMES.DETECT_DEALS
        ? QUEUE_NAMES.DECISIONS
        : jobName === JOB_NAMES.RUN_SCANNER_JOB
          ? QUEUE_NAMES.SCRAPER
          : QUEUE_NAMES.MAINTENANCE;

  const queue = new Queue(queueName, {
    connection: createRedisConnection(),
  });

  const job = await queue.add(jobName, {}, {
    removeOnComplete: 100,
    removeOnFail: 500,
  });

  console.log('[manual-run] queued', {
    queueName,
    jobName,
    jobId: job.id,
  });

  await queue.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});