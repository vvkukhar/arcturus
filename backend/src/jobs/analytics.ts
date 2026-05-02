import { ScannerJob } from '../entities';

export function calculateAnalytics(jobs: ScannerJob[]) {
  const total = jobs.length;
  const success = jobs.filter((j) => j.status === 'success').length;
  const failed = jobs.filter((j) => j.status === 'failed').length;
  const queued = jobs.filter((j) => j.status === 'queued').length;
  const running = jobs.filter((j) => j.status === 'running').length;

  return {
    total,
    success,
    failed,
    queued,
    running,
    successRate: total ? (success / total) * 100 : 0,
  };
}