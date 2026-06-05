import 'dotenv/config';
import { prisma } from './prisma';
import { browserManager } from './common/browser-manager';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickOwlSource } from './sources/brickowl/brickowl-source';
import { runBrickEconomySource } from './sources/brickeconomy/brickeconomy-source';

// Додаємо хард-таймаут (10 хвилин), щоб браузер ніколи не зависав намертво
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Scraper timed out after ${ms / 1000}s`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
};

async function processQueue() {
  // Шукаємо в БД найстарішу джобу, яка висить в черзі
  const job = await prisma.scanJob.findFirst({
    where: { status: 'queued' },
    orderBy: { createdAt: 'asc' }
  });

  if (!job) return; // Черга порожня

  console.log(`🚀 [Scraper DB-Poller] Picked up job ${job.id} -> ${job.sourceCode}`);

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
    
    console.log(`✅ [Scraper] Job ${job.id} success`);

  } catch (error: any) {
    console.error(`❌ [Scraper] Job ${job.id} failed:`, error.message);
    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({ where: { id: job.id }, data: { status: 'failed', finishedAt: new Date(), errorMessage: error.message } });
      await tx.syncErrorLog.create({ data: { scope: 'scanner_job', sourceCode: job.sourceCode, referenceId: job.id, message: 'Scanner job failed', detailsJson: { error: error.message } } });
    });
  } finally {
    await browserManager.restart(); // Очищаємо RAM
  }
}

async function main() {
  console.log('🟢 Scraper DB-Polling Worker started and waiting for jobs...');
  await prisma.activityLog.create({ data: { action: 'system.scraper_boot', payloadJson: { status: 'polling_db' } } }).catch(()=>{});
  
  while (true) {
    try {
      await processQueue();
    } catch (e) {
      console.error('❌ [Scraper Loop Error]', e);
    }
    // Чекаємо 5 секунд перед наступною перевіркою бази
    await new Promise(res => setTimeout(res, 5000));
  }
}

main().catch(console.error);