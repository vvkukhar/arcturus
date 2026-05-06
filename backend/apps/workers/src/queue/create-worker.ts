import { Worker } from 'bullmq';
import { createRedisConnection } from './redis-connection';
import { routeJob } from './job-router';
import { logJobFailure, logJobStart, logJobSuccess } from './job-logger';

export function createArcturusWorker(queueName: string): Worker {
  const worker = new Worker(
    queueName,
    async (job) => {
      logJobStart(job);
      const result = await routeJob(job);
      logJobSuccess(job, result);
      return result;
    },
    {
      connection: createRedisConnection(),
      concurrency: Number(process.env.WORKER_CONCURRENCY ?? 3),
      lockDuration: 1000 * 60 * 10,
    },
  );

  worker.on('failed', (job, error) => {
    logJobFailure(job, error);
  });

  worker.on('error', (error) => {
    console.error(`[worker:error] queue=${queueName}`, error);
  });

  return worker;
}