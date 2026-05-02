import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScannerExecutorService } from './scanner-executor.service';
import { IngestListingInput, ScannerService } from './scanner.service';

@Controller('scanner')
export class ScannerController {
  constructor(
    private readonly service: ScannerService,
    private readonly executor: ScannerExecutorService,
  ) {}

  @Post('sources')
  createSource(
    @Body()
    body: {
      code: string;
      name: string;
      type?: string | null;
      enabled?: boolean | null;
    },
  ): Promise<unknown> {
    return this.service.createSource(body);
  }

  @Get('sources')
  getSources(): Promise<unknown[]> {
    return this.service.getSources();
  }

  @Post('jobs')
  enqueueScan(
    @Body()
    body: {
      sourceCode: string;
      query?: string | null;
    },
  ): Promise<unknown> {
    return this.service.enqueueScan(body);
  }

  @Get('jobs')
  getJobs(): Promise<unknown[]> {
    return this.service.getJobs();
  }

  @Post('jobs/run')
  runJob(
    @Body()
    body: {
      jobId: string;
      listings?: IngestListingInput[];
    },
  ): Promise<unknown> {
    return this.executor.runJob(body);
  }

  @Post('ingest')
  ingestListings(
    @Body()
    body: {
      sourceCode: string;
      listings: IngestListingInput[];
    },
  ): Promise<unknown[]> {
    return this.service.ingestListings(body);
  }

  @Post('mark-stale')
  markStale(
    @Body()
    body: {
      sourceCode: string;
    },
  ): Promise<unknown> {
    return this.service.markStaleMissingListings(body.sourceCode);
  }

  @Get('listings')
  getListings(
    @Query('sourceCode') sourceCode?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.service.getListings({
      sourceCode,
      limit: limit ? Number(limit) : 100,
    });
  }
}