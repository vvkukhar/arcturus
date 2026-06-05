import 'dotenv/config';
import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { prisma } from './prisma';
import { browserManager } from './common/browser-manager';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickOwlSource } from './sources/brickowl/brickowl-source';
import { runBrickEconomySource } from './sources/brickeconomy/brickeconomy-source';

const redisUrl = process.env.REDIS_URL?.trim();
const connection = redisUrl
  ? new Redis(redisUrl, { maxRetriesPerRequest: null, enableReadyCheck: false, family: 0 })
  : new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: Number(process.env.REDIS_PORT || 6379),
      password: process.env.REDIS_PASSWORD,
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      family: 0
    });

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Scraper timed out after ${ms / 1000}s. Killed to save RAM.`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

async function processJob(job: Job) {
  if (job.name !== 'run-scanner') return;

  const jobId = job.data?.jobId;
  if (!jobId) throw new Error('Missing jobId in payload');

  const scanJob = await prisma.scanJob.findUnique({ where: { id: jobId } });
  if (!scanJob) throw new Error(`ScanJob not found: ${jobId}`);

  await prisma.scanJob.update({
    where: { id: jobId },
    data: { status: 'running', startedAt: new Date(), errorMessage: null },
  });

  try {
    await browserManager.init();

    const query = scanJob.query;

    await withTimeout((async () => {
      switch (scanJob.sourceCode) {
        case 'olx': await runOlxSource(query); break;
        case 'bricklink': await runBrickLinkSource(query); break;
        case 'ebay': await runEbaySource(query); break;
        case 'brickowl': await runBrickOwlSource(query); break;
        case 'brickeconomy': await runBrickEconomySource(query); break;
        default: throw new Error(`Unknown source code: ${scanJob.sourceCode}`);
      }
    })(), 10 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({ where: { id: jobId }, data: { status: 'success', finishedAt: new Date() } });
      await tx.activityLog.create({
        data: { action: 'worker.scanner.job_completed', payloadJson: { jobId, sourceCode: scanJob.sourceCode } }
      });
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({ where: { id: jobId }, data: { status: 'failed', finishedAt: new Date(), errorMessage: message } });
      await tx.syncErrorLog.create({
        data: { scope: 'scanner_job', sourceCode: scanJob.sourceCode, referenceId: jobId, message: 'Scanner job failed', detailsJson: { error: message } }
      });
    });
    throw error;
  } finally {
    await browserManager.restart();
  }
}

const worker = new Worker('scrapers', processJob, {
  connection,
  concurrency: 1,
  lockDuration: 1000 * 60 * 15,
});

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} crashed hard:`, err);
});

const shutdown = async () => {
  await worker.close();
  await browserManager.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);