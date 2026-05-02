import 'dotenv/config';
import { prisma } from './prisma';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function runAll(): Promise<void> {
  await runOlxSource();
  await runBrickLinkSource();
}

async function main(): Promise<void> {
  while (true) {
    try {
      await runAll();
      console.log('[scraper-loop]', new Date().toISOString(), 'completed');
    } catch (error) {
      console.error('[scraper-loop-failed]', error);
    }

    await sleep(1000 * 60 * 20);
  }
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});