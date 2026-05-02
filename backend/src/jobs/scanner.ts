import { ScannerSource, ScannerJob } from '../entities';
import { JobQueue } from './queue';

export class Scanner {
  private queue: JobQueue;
  private sources: ScannerSource[] = [];

  constructor(queue: JobQueue) {
    this.queue = queue;
  }

  addSource(source: ScannerSource) {
    this.sources.push(source);
  }

  removeSource(code: string) {
    this.sources = this.sources.filter((s) => s.code !== code);
  }

  createJob(sourceCode: string, query?: string): ScannerJob {
    const job: ScannerJob = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      sourceCode,
      query: query ?? null,
      status: 'queued',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.queue.add(job);
    return job;
  }

  listSources(): ScannerSource[] {
    return [...this.sources];
  }
}