import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES, JOB_NAMES } from '../queue/queue.constants';
import { SyncStateService } from './sync-state.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncOrchestratorService {
  constructor(
    @InjectQueue(QUEUE_NAMES.SYNC) private readonly syncQueue: Queue,
    private readonly syncStateService: SyncStateService,
    private readonly prisma: PrismaService,
  ) {}

  async refreshAll(): Promise<{ jobId: string; status: string; message: string }> {
    const currentState = await this.syncStateService.getState();
    if (currentState.isRunning) {
      return { jobId: '', status: 'running', message: 'Sync is already in progress' };
    }

    const totalItems = await this.prisma.item.count();
    
    // Встановлюємо статус у Redis перед відправкою задачі
    await this.syncStateService.start('global_refresh', totalItems, 'Queued global refresh');

    const job = await this.syncQueue.add(
      JOB_NAMES.GLOBAL_SYNC_REFRESH,
      { totalItems },
      { removeOnComplete: 100, removeOnFail: 500 }
    );

    return {
      jobId: job.id!,
      status: 'queued',
      message: 'Global refresh job enqueued successfully',
    };
  }

  async refreshOneItem(itemId: string): Promise<unknown> {
    const job = await this.syncQueue.add(
      JOB_NAMES.GLOBAL_SYNC_REFRESH,
      { itemId, singleItem: true },
      { removeOnComplete: 100, removeOnFail: 500 }
    );

    return { jobId: job.id, status: 'queued', itemId };
  }
}