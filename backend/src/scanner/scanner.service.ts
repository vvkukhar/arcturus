import { generateId } from '../lib/utils';

export type ScannerJobStatus = 'queued' | 'running' | 'success' | 'failed';

export type ScannerJob = {
  id: string;
  sourceCode: string;
  query?: string | null;
  status: ScannerJobStatus;
};

export class ScannerService {
  private jobs: ScannerJob[] = [];

  async enqueue(sourceCode: string, query?: string) {
    const job: ScannerJob = {
      id: generateId(),
      sourceCode,
      query: query ?? null,
      status: 'queued',
    };
    this.jobs.push(job);
    return job;
  }

  async listJobs(): Promise<ScannerJob[]> {
    return this.jobs;
  }

  async updateStatus(id: string, status: ScannerJobStatus) {
    const job = this.jobs.find((j) => j.id === id);
    if (job) job.status = status;
  }
}