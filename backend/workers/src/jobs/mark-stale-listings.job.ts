import { prisma } from '../prisma';

export async function markStaleListingsJob(params?: {
  olderThanHours?: number;
}): Promise<{
  markedStale: number;
}> {
  const olderThanHours = params?.olderThanHours ?? 48;
  const threshold = new Date(Date.now() - 1000 * 60 * 60 * olderThanHours);

  const result = await prisma.marketListing.updateMany({
    where: {
      status: 'active',
      lastSeenAt: {
        lt: threshold,
      },
    },
    data: {
      status: 'stale',
    },
  });

  return {
    markedStale: result.count,
  };
}