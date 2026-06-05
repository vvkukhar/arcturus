import 'dotenv/config';
import { prisma } from './prisma';
import { browserManager } from './common/browser-manager';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickOwlSource } from './sources/brickowl/brickowl-source';
import { runBrickEconomySource } from './sources/brickeconomy/brickeconomy-source';

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

async function cleanStuckJobs() {
  const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);
  await prisma.scanJob.updateMany({
    where: { status: 'running', startedAt: { lt: fifteenMinsAgo } },
    data: { status: 'failed', errorMessage: 'Job timed out and was killed' }
  });
}

async function processQueue() {
  await cleanStuckJobs();

  const job = await prisma.scanJob.findFirst({
    where: { status: 'queued' },
    orderBy: { createdAt: 'asc' }
  });

  if (!job) return;

  await prisma.scanJob.update({
    where: { id: job.id },
    data: { status: 'running', startedAt: new Date(), errorMessage: null }
  });

  try {
    await browserManager.init();
    const query = job.query;

    await withTimeout((async () => {
      switch (job.sourceCode) {
        case 'olx': await runOlxSource(query); break;
        case 'bricklink': await runBrickLinkSource(query); break;
        case 'ebay': await runEbaySource(query); break;
        case 'brickowl': await runBrickOwlSource(query); break;
        case 'brickeconomy': await runBrickEconomySource(query); break;
        default: throw new Error(`Unknown source: ${job.sourceCode}`);
      }
    })(), 10 * 60 * 1000);

    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({ where: { id: job.id }, data: { status: 'success', finishedAt: new Date() } });
      await tx.activityLog.create({ data: { action: 'worker.scanner.job_completed', payloadJson: { jobId: job.id, sourceCode: job.sourceCode } } });
    });

  } catch (error: any) {
    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({ where: { id: job.id }, data: { status: 'failed', finishedAt: new Date(), errorMessage: error.message } });
      await tx.syncErrorLog.create({ data: { scope: 'scanner_job', sourceCode: job.sourceCode, referenceId: job.id, message: 'Scanner job failed', detailsJson: { error: error.message } } });
    });
  } finally {
    await browserManager.restart();
  }
}

async function main() {
  await prisma.activityLog.create({ data: { action: 'system.scraper_boot', payloadJson: { status: 'polling_db' } } }).catch(()=>{});
  while (true) {
    try {
      await processQueue();
    } catch (e) {}
    await new Promise(res => setTimeout(res, 5000));
  }
}

main();