import 'dotenv/config';
import { prisma } from './prisma';
import { runBrickLinkSource } from './sources/bricklink/bricklink-source';
import { runOlxSource } from './sources/olx/olx-source';

async function main(): Promise<void> {
  const mode = process.argv[2] ?? 'all';

  if (mode === 'olx') {
    await runOlxSource();
  } else if (mode === 'bricklink') {
    await runBrickLinkSource();
  } else {
    await runOlxSource();
    await runBrickLinkSource();
  }

  await prisma.$disconnect();
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});