import 'dotenv/config';
import { prisma } from './prisma';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';
import { runEbaySource } from './sources/ebay/ebay-source';
import { runBrickOwlSource } from './sources/brickowl/brickowl-source';
import { runBrickEconomySource } from './sources/brickeconomy/brickeconomy-source';

async function main(): Promise<void> {
  const mode = process.argv[2] ?? 'all';

  if (mode === 'olx') {
    await runOlxSource();
  } else if (mode === 'bricklink') {
    await runBrickLinkSource();
  } else if (mode === 'ebay') {
    await runEbaySource();
  } else if (mode === 'brickowl') {
    await runBrickOwlSource();
  } else if (mode === 'brickeconomy') {
    await runBrickEconomySource();
  } else {
    await runOlxSource();
    await runBrickLinkSource();
    await runEbaySource();
    await runBrickOwlSource();
    await runBrickEconomySource();
  }

  await prisma.$disconnect();
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});