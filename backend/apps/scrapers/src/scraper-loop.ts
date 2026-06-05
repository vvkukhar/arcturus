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

async function processJob(job: Job) {
  if (job.name !== 'run-scanner') return;

  const jobId = job.data?.jobId;
  if (!jobId) throw new Error('Missing jobId in payload');

  const scanJob = await prisma.scanJob.findUnique({ where: { id: jobId } });
  if (!scanJob) throw new Error(`ScanJob not found: ${jobId}`);

  console.log(`[Scraper] 🚀 Starting job ${jobId} for source: ${scanJob.sourceCode}`);

  await prisma.scanJob.update({
    where: { id: jobId },
    data: { status: 'running', startedAt: new Date(), errorMessage: null },
  });

  try {
    const query = scanJob.query;

    switch (scanJob.sourceCode) {
      case 'olx': await runOlxSource(query); break;
      case 'bricklink': await runBrickLinkSource(query); break;
      case 'ebay': await runEbaySource(query); break;
      case 'brickowl': await runBrickOwlSource(query); break;
      case 'brickeconomy': await runBrickEconomySource(query); break;
      default: throw new Error(`Unknown source code: ${scanJob.sourceCode}`);
    }

    await prisma.scanJob.update({ where: { id: jobId }, data: { status: 'success', finishedAt: new Date() } });
    console.log(`[Scraper] ✅ Job ${jobId} completed successfully.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[Scraper] ❌ Job ${jobId} failed:`, message);

    await prisma.scanJob.update({ where: { id: jobId }, data: { status: 'failed', finishedAt: new Date(), errorMessage: message } });
    throw error;
  } finally {
    // 🔥 Гарантовано звільняємо пам'ять сервера після кожної джоби!
    await browserManager.restart();
  }
}

console.log('🔥 Scraper Node successfully connected to Redis and waiting for jobs...');

const worker = new Worker('scrapers', async (job) => {
  await processJob(job);
}, {
  connection,
  concurrency: 1, // Тільки 1 браузер за раз!
  lockDuration: 1000 * 60 * 15,
});

worker.on('failed', (job, err) => {
  console.error(`[Scraper] Job ${job?.id} crashed:`, err.message);
});

worker.on('error', err => {
  console.error('[Scraper] Redis Connection Error:', err.message);
});

const shutdown = async () => {
  console.log('Shutting down Scraper Worker...');
  await worker.close();
  await browserManager.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);