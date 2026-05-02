import { prisma } from '../prisma';

type IdRow = {
  id: string;
};

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
    const snapshots: IdRow[] = await prisma.marketSnapshot.findMany({
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
            in: snapshots.map((snapshot: IdRow) => snapshot.id),
          },
        },
      });

      deletedSnapshots += result.count;
    }

    const decisions: IdRow[] = await prisma.decisionSnapshot.findMany({
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
            in: decisions.map((decision: IdRow) => decision.id),
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