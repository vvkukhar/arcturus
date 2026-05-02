import type { Job } from 'bullmq';

export function logJobStart(job: Job): void {
  console.log(
    `[worker:start] queue=${job.queueName} job=${job.name} id=${job.id}`,
    JSON.stringify(job.data ?? {}),
  );
}

export function logJobSuccess(job: Job, result: unknown): void {
  console.log(
    `[worker:success] queue=${job.queueName} job=${job.name} id=${job.id}`,
    JSON.stringify(result ?? {}),
  );
}

export function logJobFailure(job: Job | undefined, error: unknown): void {
  console.error(
    `[worker:failed] queue=${job?.queueName ?? 'unknown'} job=${job?.name ?? 'unknown'} id=${job?.id ?? 'unknown'}`,
    error,
  );
}