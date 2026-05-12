import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

export type SyncRunStatus = 'idle' | 'running' | 'finished' | 'failed';

export type SyncRunState = {
  status: SyncRunStatus;
  isRunning: boolean;
  startedAt: Date | null;
  finishedAt: Date | null;
  lastMode: string | null;
  processedItems: number;
  totalItems: number;
  message: string | null;
  errorMessage: string | null;
};

const SYNC_STATE_KEY = 'sync:global_state';
const SYNC_CHANNEL = 'sync_events';

@Injectable()
export class SyncStateService implements OnModuleInit, OnModuleDestroy {
  private subClient: any;

  constructor(
    private readonly redis: RedisService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async onModuleInit() {
    // Створюємо дублікат клієнта для підписки, щоб не блокувати основний пул
    this.subClient = this.redis.getClient().duplicate();
    await this.subClient.subscribe(SYNC_CHANNEL);
    
    this.subClient.on('message', (channel: string, message: string) => {
      if (channel === SYNC_CHANNEL) {
        try {
          const { event, payload } = JSON.parse(message);
          
          // Прокидаємо подію від воркера на фронт через Socket.io
          this.realtime.emitCustom(event, payload);
          
          if (event === 'sync.finished' || event === 'sync.failed') {
             this.realtime.emitDashboardRefresh('sync_completed');
             this.realtime.emitOpportunityRefresh('sync_completed');
          }
        } catch (e) {
          console.error('[SyncStateService] Failed to parse sync event', e);
        }
      }
    });
  }

  async onModuleDestroy() {
    if (this.subClient) {
      await this.subClient.quit();
    }
  }

  private getDefaultState(): SyncRunState {
    return {
      status: 'idle',
      isRunning: false,
      startedAt: null,
      finishedAt: null,
      lastMode: null,
      processedItems: 0,
      totalItems: 0,
      message: null,
      errorMessage: null,
    };
  }

  async getState(): Promise<SyncRunState> {
    const state = await this.redis.get<SyncRunState>(SYNC_STATE_KEY);
    if (!state) return this.getDefaultState();
    
    // Redis зберігає дати як рядки, перетворюємо назад
    if (state.startedAt) state.startedAt = new Date(state.startedAt);
    if (state.finishedAt) state.finishedAt = new Date(state.finishedAt);
    
    return state;
  }

  async reset(): Promise<void> {
    await this.redis.set(SYNC_STATE_KEY, this.getDefaultState());
  }

  async start(mode: string, totalItems: number, message?: string): Promise<void> {
    const state: SyncRunState = {
      status: 'running',
      isRunning: true,
      startedAt: new Date(),
      finishedAt: null,
      lastMode: mode,
      processedItems: 0,
      totalItems,
      message: message ?? null,
      errorMessage: null,
    };
    await this.redis.set(SYNC_STATE_KEY, state);
  }
}