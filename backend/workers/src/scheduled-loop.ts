import 'dotenv/config';
import { scheduledRefreshJob } from './jobs/scheduled-refresh.job';
import { prisma } from './prisma';

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(): Promise<void> {
  const intervalMinutes = Number(process.env.WORKER_INTERVAL_MINUTES ?? 15);

  while (true) {
    try {
      const result = await scheduledRefreshJob();

      console.log(
        '[scheduled-loop]',
        new Date().toISOString(),
        JSON.stringify(result),
      );
    } catch (error) {
      console.error('[scheduled-loop-failed]', error);
    }

    await sleep(1000 * 60 * intervalMinutes);
  }
}

main().catch(async (error: unknown) => {
  console.error(error);
  await prisma.$disconnect();
  process.exit(1);
});