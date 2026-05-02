import { Injectable } from '@nestjs/common';

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

@Injectable()
export class SyncStateService {
  private state: SyncRunState = {
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

  start(mode: string, totalItems: number, message?: string): void {
    this.state = {
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
  }

  progress(processedItems: number, message?: string): void {
    this.state = {
      ...this.state,
      processedItems,
      message: message ?? this.state.message,
    };
  }

  finish(message?: string): void {
    this.state = {
      ...this.state,
      status: 'finished',
      isRunning: false,
      finishedAt: new Date(),
      processedItems: this.state.totalItems,
      message: message ?? this.state.message,
      errorMessage: null,
    };
  }

  fail(errorMessage?: string): void {
    this.state = {
      ...this.state,
      status: 'failed',
      isRunning: false,
      finishedAt: new Date(),
      errorMessage: errorMessage ?? 'Sync failed',
    };
  }

  reset(): void {
    this.state = {
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

  getState(): SyncRunState {
    return this.state;
  }
}