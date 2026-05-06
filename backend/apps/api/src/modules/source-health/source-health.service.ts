import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SourceHealthRow = {
  sourceCode: string;
  sourceName: string;
  enabled: boolean;
  listingCount: number;
  activeListingCount: number;
  soldListingCount: number;
  latestRunStatus: string;
  latestRunStartedAt: Date | null;
  latestRunFinishedAt: Date | null;
  latestRunItemsSeen: number;
  latestRunItemsMatched: number;
  latestRunItemsInserted: number;
  latestRunItemsUpdated: number;
  latestRunId: string | null;
  freshnessLabel: string;
  latestListingAt: Date | null;
  latestErrorMessage: string | null;
  latestErrorAt: Date | null;
};

@Injectable()
export class SourceHealthService {
  constructor(private readonly prisma: PrismaService) {}

  private getFreshnessLabel(date: Date | null): string {
    if (!date) {
      return 'missing';
    }

    const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 6) return 'fresh';
    if (diffHours <= 24) return 'recent';
    if (diffHours <= 72) return 'aging';

    return 'stale';
  }

  async getSourceHealthSummary(): Promise<SourceHealthRow[]> {
    const sources = await this.prisma.marketSource.findMany({
      orderBy: {
        code: 'asc',
      },
    });

    const result: SourceHealthRow[] = [];

    for (const source of sources) {
      const [
        latestRun,
        latestListing,
        listingCount,
        activeListingCount,
        soldListingCount,
        latestError,
      ] = await Promise.all([
        this.prisma.sourceRunLog.findFirst({
          where: {
            sourceId: source.id,
          },
          orderBy: {
            startedAt: 'desc',
          },
        }),
        this.prisma.marketListing.findFirst({
          where: {
            sourceId: source.id,
          },
          orderBy: {
            fetchedAt: 'desc',
          },
        }),
        this.prisma.marketListing.count({
          where: {
            sourceId: source.id,
          },
        }),
        this.prisma.marketListing.count({
          where: {
            sourceId: source.id,
            status: 'active',
          },
        }),
        this.prisma.marketListing.count({
          where: {
            sourceId: source.id,
            status: 'sold',
          },
        }),
        this.prisma.syncErrorLog.findFirst({
          where: {
            sourceCode: source.code,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      result.push({
        sourceCode: source.code,
        sourceName: source.name,
        enabled: source.enabled,
        listingCount,
        activeListingCount,
        soldListingCount,
        latestRunStatus: latestRun?.status ?? 'never',
        latestRunStartedAt: latestRun?.startedAt ?? null,
        latestRunFinishedAt: latestRun?.finishedAt ?? null,
        latestRunItemsSeen: latestRun?.itemsSeen ?? 0,
        latestRunItemsMatched: latestRun?.itemsMatched ?? 0,
        latestRunItemsInserted: latestRun?.itemsInserted ?? 0,
        latestRunItemsUpdated: latestRun?.itemsUpdated ?? 0,
        latestRunId: latestRun?.id ?? null,
        freshnessLabel: this.getFreshnessLabel(latestListing?.fetchedAt ?? null),
        latestListingAt: latestListing?.fetchedAt ?? null,
        latestErrorMessage: latestError?.message ?? null,
        latestErrorAt: latestError?.createdAt ?? null,
      });
    }

    return result;
  }

  async getRecentRunHistory(limit = 30): Promise<unknown[]> {
    return this.prisma.sourceRunLog.findMany({
      orderBy: {
        startedAt: 'desc',
      },
      take: limit,
      include: {
        source: true,
      },
    });
  }

  async getRunById(runId: string): Promise<unknown> {
    const run = await this.prisma.sourceRunLog.findUnique({
      where: {
        id: runId,
      },
      include: {
        source: true,
      },
    });

    if (!run) {
      throw new NotFoundException('Source run not found');
    }

    return run;
  }

  async getRecentSyncErrors(
    limit = 50,
    sourceCode?: string,
  ): Promise<unknown[]> {
    return this.prisma.syncErrorLog.findMany({
      where: {
        sourceCode: sourceCode ?? undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async getSourceDetail(sourceCode: string): Promise<unknown> {
    const source = await this.prisma.marketSource.findUnique({
      where: {
        code: sourceCode,
      },
    });

    if (!source) {
      throw new NotFoundException('Source not found');
    }

    const [runs, errors, listings] = await Promise.all([
      this.prisma.sourceRunLog.findMany({
        where: {
          sourceId: source.id,
        },
        orderBy: {
          startedAt: 'desc',
        },
        take: 20,
      }),
      this.prisma.syncErrorLog.findMany({
        where: {
          sourceCode,
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 20,
      }),
      this.prisma.marketListing.findMany({
        where: {
          sourceId: source.id,
        },
        orderBy: {
          fetchedAt: 'desc',
        },
        take: 30,
        include: {
          item: true,
        },
      }),
    ]);

    return {
      source,
      runs,
      errors,
      listings,
    };
  }
}