import 'dotenv/config';
import { prisma } from './prisma';
import { browserManager } from './common/browser-manager';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickowlSource } from './sources/brickowl/brickowl-source';
import { runBrickeconomySource } from './sources/brickeconomy/brickeconomy-source';

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
    { name: 'Olx', fn: runOlxSource },
    { name: 'BrickLink', fn: runBrickLinkSource },
    { name: 'Ebay', fn: runEbaySource },
    { name: 'BrickOwl', fn: runBrickowlSource },
    { name: 'BrickEconomy', fn: runBrickeconomySource }
  ];

  for (const source of sources) {
    if (isShuttingDown) break;
    try {
      await source.fn();
    } catch (error) {
      console.error(`[Scraper Error] Source ${source.name} failed:`, error);
      await prisma.syncErrorLog.create({
        data: {
          scope: 'scraper_loop',
          sourceCode: source.name.toLowerCase(),
          message: error instanceof Error ? error.message : String(error),
        }
      });
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