import { prisma } from '../prisma';

export async function sourceHealthRollupJob(): Promise<{
  sourcesChecked: number;
  errorsCreated: number;
}> {
  const sources = await prisma.marketSource.findMany();

  let errorsCreated = 0;

  for (const source of sources) {
    if (!source.enabled) {
      continue;
    }

    const latestListing = await prisma.marketListing.findFirst({
      where: {
        sourceId: source.id,
      },
      orderBy: {
        fetchedAt: 'desc',
      },
      select: {
        fetchedAt: true,
      },
    });

    if (!latestListing) {
      await prisma.syncErrorLog.create({
        data: {
          scope: 'source_health',
          sourceCode: source.code,
          message: 'Enabled source has no listings',
          detailsJson: {
            sourceId: source.id,
          },
        },
      });

      errorsCreated += 1;
      continue;
    }

    const diffHours =
      (Date.now() - latestListing.fetchedAt.getTime()) / (1000 * 60 * 60);

    if (diffHours > 48) {
      await prisma.syncErrorLog.create({
        data: {
          scope: 'source_health',
          sourceCode: source.code,
          message: 'Source listings are stale',
          detailsJson: {
            sourceId: source.id,
            latestListingAt: latestListing.fetchedAt,
            diffHours,
          },
        },
      });

      errorsCreated += 1;
    }
  }

  return {
    sourcesChecked: sources.length,
    errorsCreated,
  };
}