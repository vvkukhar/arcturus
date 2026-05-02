import 'dotenv/config';
import { prisma } from './prisma';
import { createArcturusWorker } from './queue/create-worker';
import { QUEUE_NAMES } from './queue/queue.constants';
import { registerRepeatableJobs } from './queue/scheduler';

async function main(): Promise<void> {
  await registerRepeatableJobs();

  const workers = [
    createArcturusWorker(QUEUE_NAMES.MARKET),
    createArcturusWorker(QUEUE_NAMES.DECISIONS),
    createArcturusWorker(QUEUE_NAMES.SCRAPER),
    createArcturusWorker(QUEUE_NAMES.MAINTENANCE),
  ];

  console.log('[workers] started', workers.map((worker) => worker.name));

  const shutdown = async () => {
    console.log('[workers] shutting down');

    await Promise.all(workers.map((worker) => worker.close()));
    await prisma.$disconnect();

    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(async (error: unknown) => {
  console.error('[workers] failed to start', error);
  await prisma.$disconnect();
  process.exit(1);
});