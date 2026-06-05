import { Worker, Job } from 'bullmq';
import { QUEUE_NAMES } from './queue.constants';
import { createRedisConnection } from './redis-connection';
import { routeJob } from './job-router';

export function startWorkers() {
  const connection = createRedisConnection();

  const concurrencyLevels = {
    [QUEUE_NAMES.MARKET]: Number(process.env.MARKET_CONCURRENCY) || 5,
    [QUEUE_NAMES.DECISIONS]: Number(process.env.DECISIONS_CONCURRENCY) || 5,
    [QUEUE_NAMES.MAINTENANCE]: Number(process.env.MAINTENANCE_CONCURRENCY) || 2,
    [QUEUE_NAMES.SYNC]: Number(process.env.SYNC_CONCURRENCY) || 3,
  };

  // 🔥 ФІКС: Виключаємо чергу SCRAPERS. Її має обробляти окремий контейнер з браузером!
  const activeQueues = Object.values(QUEUE_NAMES).filter(q => q !== QUEUE_NAMES.SCRAPERS);

  const workers = activeQueues.map((queueName) => {
    const worker = new Worker(queueName, async (job: Job) => routeJob(job), { 
      connection, 
      concurrency: concurrencyLevels[queueName],
      lockDuration: 1000 * 60 * 5,
      removeOnComplete: { count: 10 },
      removeOnFail: { count: 20 },
      stalledInterval: 30000,
    });

    worker.on('failed', (job, err) => {
      console.error(`[CRITICAL] Queue: ${queueName} | Job: ${job?.name} | ID: ${job?.id}`, err);
    });

    return worker;
  });

  const shutdown = async () => {
    await Promise.allSettled(workers.map(w => w.close()));
    connection.quit();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}