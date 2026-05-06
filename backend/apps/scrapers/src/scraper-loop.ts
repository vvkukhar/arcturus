import 'dotenv/config';
import { prisma } from './prisma';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickowlSource } from './sources/brickowl/brickowl-source';
import { runBrickeconomySource } from './sources/brickeconomy/brickeconomy-source';

async function runAll(): Promise<void> {
  await Promise.allSettled([
    runOlxSource(),
    runBrickLinkSource(),
    runEbaySource(),
    runBrickowlSource(),
    runBrickeconomySource()
  ]);
}

async function main(): Promise<void> {
  while (true) {
    try {
      await runAll();
    } catch (error) {
      console.error(error);
    }
    await new Promise((res) => setTimeout(res, 1200000));
  }
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});