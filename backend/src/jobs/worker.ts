import { dequeueJob } from './queue';

export async function startWorker(queue: string, handler: (payload: any) => Promise<void>) {
  while (true) {
    const job = await dequeueJob(queue);
    if (job) {
      try {
        await handler(job.payload);
      } catch (err) {
        console.error('Job failed', err);
      }
    } else {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
}