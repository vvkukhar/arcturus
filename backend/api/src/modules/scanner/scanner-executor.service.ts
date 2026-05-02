import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ScannerService, IngestListingInput } from './scanner.service';

@Injectable()
export class ScannerExecutorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly scanner: ScannerService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async runJob(body: {
    jobId: string;
    listings?: IngestListingInput[];
  }): Promise<unknown> {
    const job = await this.prisma.scanJob.findUnique({
      where: {
        id: body.jobId,
      },
    });

    if (!job) {
      throw new NotFoundException('Scan job not found');
    }

    const started = await this.prisma.scanJob.update({
      where: {
        id: job.id,
      },
      data: {
        status: 'running',
        startedAt: new Date(),
      },
    });

    this.realtime.emitCustom('scanner.job_started', started);

    try {
      const listings = await this.scanner.ingestListings({
        sourceCode: job.sourceCode,
        listings: body.listings ?? [],
      });

      await this.scanner.markStaleMissingListings(job.sourceCode);

      const completed = await this.prisma.scanJob.update({
        where: {
          id: job.id,
        },
        data: {
          status: 'completed',
          finishedAt: new Date(),
          resultCount: listings.length,
        },
      });

      this.realtime.emitCustom('scanner.job_completed', completed);
      this.realtime.emitDashboardRefresh('scanner_job_completed');

      return completed;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      const failed = await this.prisma.scanJob.update({
        where: {
          id: job.id,
        },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          errorMessage: message,
        },
      });

      await this.prisma.syncErrorLog.create({
        data: {
          scope: 'scanner_job',
          sourceCode: job.sourceCode,
          referenceId: job.id,
          message,
          detailsJson: {
            jobId: job.id,
          },
        },
      });

      this.realtime.emitCustom('scanner.job_failed', failed);

      throw error;
    }
  }
}