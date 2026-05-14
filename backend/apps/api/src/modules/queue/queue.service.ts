import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES, JOB_NAMES } from './queue.constants';

function createSharedRedisClient(): Redis {
  const redisUrl = process.env.REDIS_URL?.trim();
  const options = { maxRetriesPerRequest: null, enableReadyCheck: false };

  if (redisUrl) {
    return new Redis(redisUrl, options);
  }

  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    ...options,
  });
}

@Injectable()
export class QueueService implements OnModuleDestroy {
  private readonly redisClient = createSharedRedisClient();

  private readonly marketQueue = new Queue(QUEUE_NAMES.MARKET, {
    connection: this.redisClient,
  });

  private readonly decisionsQueue = new Queue(QUEUE_NAMES.DECISIONS, {
    connection: this.redisClient,
  });

  private readonly scraperQueue = new Queue(QUEUE_NAMES.SCRAPER, {
    connection: this.redisClient,
  });

  private readonly maintenanceQueue = new Queue(QUEUE_NAMES.MAINTENANCE, {
    connection: this.redisClient,
  });

  async onModuleDestroy() {
    await Promise.all([
      this.marketQueue.close(),
      this.decisionsQueue.close(),
      this.scraperQueue.close(),
      this.maintenanceQueue.close(),
    ]);
    await this.redisClient.quit();
  }

  async enqueueMarketSnapshots(): Promise<unknown> {
    return this.marketQueue.add(JOB_NAMES.RECOMPUTE_MARKET_SNAPSHOTS, {}, { removeOnComplete: 100, removeOnFail: 500 });
  }

  async enqueueDecisions(): Promise<unknown> {
    return this.decisionsQueue.add(JOB_NAMES.RECOMPUTE_DECISIONS, {}, { removeOnComplete: 100, removeOnFail: 500 });
  }

  async enqueueDealDetection(): Promise<unknown> {
    return this.decisionsQueue.add(JOB_NAMES.DETECT_DEALS, {}, { removeOnComplete: 100, removeOnFail: 500 });
  }

  async enqueueScheduledRefresh(): Promise<unknown> {
    return this.maintenanceQueue.add(JOB_NAMES.SCHEDULED_REFRESH, {}, { removeOnComplete: 100, removeOnFail: 500 });
  }

  async enqueueScannerJob(jobId: string): Promise<unknown> {
    return this.scraperQueue.add(JOB_NAMES.RUN_SCANNER_JOB, { jobId }, { removeOnComplete: 100, removeOnFail: 500 });
  }

  async stats(): Promise<unknown> {
    const queues = [this.marketQueue, this.decisionsQueue, this.scraperQueue, this.maintenanceQueue];
    const result = [];

    for (const queue of queues) {
      const [waiting, active, completed, failed, delayed] = await Promise.all([
        queue.getWaitingCount(),
        queue.getActiveCount(),
        queue.getCompletedCount(),
        queue.getFailedCount(),
        queue.getDelayedCount(),
      ]);

      result.push({ name: queue.name, waiting, active, completed, failed, delayed });
    }

    return result;
  }
}