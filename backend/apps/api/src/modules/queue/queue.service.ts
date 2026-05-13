import { Injectable } from '@nestjs/common';
import { Queue, type ConnectionOptions } from 'bullmq';
import { QUEUE_NAMES, JOB_NAMES } from './queue.constants';

function redisConnection(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (redisUrl) {
    return {
      url: redisUrl,
      maxRetriesPerRequest: null,
    };
  }

  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  };
}

@Injectable()
export class QueueService {
  private readonly connection = redisConnection();

  private readonly marketQueue = new Queue(QUEUE_NAMES.MARKET, {
    connection: this.connection,
  });

  private readonly decisionsQueue = new Queue(QUEUE_NAMES.DECISIONS, {
    connection: this.connection,
  });

  private readonly scraperQueue = new Queue(QUEUE_NAMES.SCRAPER, {
    connection: this.connection,
  });

  private readonly maintenanceQueue = new Queue(QUEUE_NAMES.MAINTENANCE, {
    connection: this.connection,
  });

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