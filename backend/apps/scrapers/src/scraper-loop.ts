import 'dotenv/config';
import { prisma } from './prisma';
import { browserManager } from './common/browser-manager';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickOwlSource } from './sources/brickowl/brickowl-source';
import { runBrickEconomySource } from './sources/brickeconomy/brickeconomy-source';

let isShuttingDown = false;

function setupGracefulShutdown() {
  const shutdown = async () => {
    isShuttingDown = true;
    await browserManager.close();
    await prisma.$disconnect();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

async function runAll() {
  const sources = [
    { name: 'olx', fn: runOlxSource },
    { name: 'bricklink', fn: runBrickLinkSource },
    { name: 'ebay', fn: runEbaySource },
    { name: 'brickowl', fn: runBrickOwlSource },
    { name: 'brickeconomy', fn: runBrickEconomySource }
  ];

  const results = await Promise.allSettled(sources.map(s => s.fn()));

  for (let i = 0; i < results.length; i++) {
    if (results[i].status === 'rejected') {
      const error = (results[i] as PromiseRejectedResult).reason;
      await prisma.syncErrorLog.create({
        data: {
          scope: 'scraper_loop',
          sourceCode: sources[i].name,
          message: error instanceof Error ? error.message : String(error),
        }
      }).catch(() => {});
    }
  }
}

async function main() {
  setupGracefulShutdown();
  await browserManager.init();
  const interval = Number(process.env.SCRAPER_INTERVAL_MS ?? 1200000);
  
  while (!isShuttingDown) {
    try {
      await runAll();
    } catch (error) {
      console.error('[Scraper Loop Fatal Error]:', error);
    }
    if (isShuttingDown) break;
    await new Promise((res) => setTimeout(res, interval));
  }
}

main().catch(async (error) => {
  console.error('[Scraper Loop Exit]:', error);
  await browserManager.close();
  await prisma.$disconnect();
  process.exit(1);
});