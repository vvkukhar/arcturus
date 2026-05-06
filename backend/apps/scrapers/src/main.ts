import 'dotenv/config';
import { prisma } from './prisma';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickowlSource } from './sources/brickowl/brickowl-source';
import { runBrickeconomySource } from './sources/brickeconomy/brickeconomy-source';

async function main(): Promise<void> {
  const mode = process.argv[2] ?? 'all';

  if (mode === 'olx') {
    await runOlxSource();
  } else if (mode === 'bricklink') {
    await runBrickLinkSource();
  } else if (mode === 'ebay') {
    await runEbaySource();
  } else if (mode === 'brickowl') {
    await runBrickowlSource();
  } else if (mode === 'brickeconomy') {
    await runBrickeconomySource();
  } else {
    await runOlxSource();
    await runBrickLinkSource();
    await runEbaySource();
    await runBrickowlSource();
    await runBrickeconomySource();
  }

  await prisma.$disconnect();
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});