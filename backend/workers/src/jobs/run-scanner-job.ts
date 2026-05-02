import { prisma } from '../prisma';

export async function runScannerJob(jobId: string): Promise<{
  jobId: string;
  status: string;
}> {
  const job = await prisma.scanJob.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!job) {
    throw new Error(`ScanJob not found: ${jobId}`);
  }

  await prisma.scanJob.update({
    where: {
      id: jobId,
    },
    data: {
      status: 'running',
      startedAt: new Date(),
      errorMessage: null,
    },
  });

  try {
    // Реальний scraper runner підключається тут.
    // Поки це production-safe stub: job переходить у success,
    // а конкретні source runners можна підвісити пізніше по sourceCode.
    await prisma.scanJob.update({
      where: {
        id: jobId,
      },
      data: {
        status: 'success',
        finishedAt: new Date(),
      },
    });

    await prisma.activityLog.create({
      data: {
        action: 'worker.scanner.job_completed',
        payloadJson: {
          jobId,
          sourceCode: job.sourceCode,
          query: job.query,
        },
      },
    });

    return {
      jobId,
      status: 'success',
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.scanJob.update({
      where: {
        id: jobId,
      },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        errorMessage: message,
      },
    });

    await prisma.syncErrorLog.create({
      data: {
        scope: 'scanner_job',
        sourceCode: job.sourceCode,
        referenceId: jobId,
        message: 'Scanner job failed',
        detailsJson: {
          error: message,
        },
      },
    });

    throw error;
  }
}