import { prisma } from '../prisma';

export async function cleanupOldSnapshotsJob(params?: {
  keepPerItem?: number;
}): Promise<{
  deletedSnapshots: number;
  deletedDecisions: number;
}> {
  const keepPerItem = params?.keepPerItem ?? 30;

  const items = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  let deletedSnapshots = 0;
  let deletedDecisions = 0;

  for (const item of items) {
    const snapshots = await prisma.marketSnapshot.findMany({
      where: {
        itemId: item.id,
      },
      orderBy: {
        computedAt: 'desc',
      },
      skip: keepPerItem,
      select: {
        id: true,
      },
    });

    if (snapshots.length > 0) {
      const result = await prisma.marketSnapshot.deleteMany({
        where: {
          id: {
            in: snapshots.map((snapshot) => snapshot.id),
          },
        },
      });

      deletedSnapshots += result.count;
    }

    const decisions = await prisma.decisionSnapshot.findMany({
      where: {
        itemId: item.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: keepPerItem,
      select: {
        id: true,
      },
    });

    if (decisions.length > 0) {
      const result = await prisma.decisionSnapshot.deleteMany({
        where: {
          id: {
            in: decisions.map((decision) => decision.id),
          },
        },
      });

      deletedDecisions += result.count;
    }
  }

  return {
    deletedSnapshots,
    deletedDecisions,
  };
}