import { prisma } from '../prisma';
import {
  runOlxSource,
  runBrickLinkSource,
  runEbaySource,
  runBrickOwlSource,
  runBrickEconomySource
} from '@arcturus/scrapers';

export async function runScannerJob(jobId: string): Promise<{
  jobId: string;
  status: string;
}> {
  const job = await prisma.scanJob.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new Error(`ScanJob not found: ${jobId}`);
  }

  await prisma.scanJob.update({
    where: { id: jobId },
    data: {
      status: 'running',
      startedAt: new Date(),
      errorMessage: null,
    },
  });

  try {
    switch (job.sourceCode) {
      case 'olx':
        await runOlxSource();
        break;
      case 'bricklink':
        await runBrickLinkSource();
        break;
      case 'ebay':
        await runEbaySource();
        break;
      case 'brickowl':
        await runBrickOwlSource();
        break;
      case 'brickeconomy':
        await runBrickEconomySource();
        break;
      default:
        throw new Error(`Unknown source code: ${job.sourceCode}`);
    }

    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({
        where: { id: jobId },
        data: {
          status: 'success',
          finishedAt: new Date(),
        },
      });

      await tx.activityLog.create({
        data: {
          action: 'worker.scanner.job_completed',
          payloadJson: {
            jobId,
            sourceCode: job.sourceCode,
            query: job.query,
          },
        },
      });
    });

    return { jobId, status: 'success' };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.$transaction(async (tx) => {
      await tx.scanJob.update({
        where: { id: jobId },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          errorMessage: message,
        },
      });

      await tx.syncErrorLog.create({
        data: {
          scope: 'scanner_job',
          sourceCode: job.sourceCode,
          referenceId: jobId,
          message: 'Scanner job failed',
          detailsJson: { error: message },
        },
      });
    });

    throw error;
  }
}