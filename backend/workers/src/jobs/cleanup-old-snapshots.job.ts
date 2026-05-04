import { prisma } from '../prisma';

export async function cleanupOldSnapshotsJob(params?: {
  keepPerItem?: number;
}): Promise<{
  deletedSnapshots: number;
  deletedDecisions: number;
}> {
  const keepPerItem = params?.keepPerItem ?? 30;

  const items = await prisma.item.findMany({
    select: { id: true },
  });

  let deletedSnapshots = 0;
  let deletedDecisions = 0;

  const chunkSize = 50;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    
    await Promise.all(
      chunk.map(async (item) => {
        const snapshots = await prisma.marketSnapshot.findMany({
          where: { itemId: item.id },
          orderBy: { computedAt: 'desc' },
          skip: keepPerItem,
          select: { id: true },
        });

        if (snapshots.length > 0) {
          const snapshotIds = snapshots.map((s) => s.id);
          const result = await prisma.marketSnapshot.deleteMany({
            where: { id: { in: snapshotIds } },
          });
          deletedSnapshots += result.count;
        }

        const decisions = await prisma.decisionSnapshot.findMany({
          where: { itemId: item.id },
          orderBy: { createdAt: 'desc' },
          skip: keepPerItem,
          select: { id: true },
        });

        if (decisions.length > 0) {
          const decisionIds = decisions.map((d) => d.id);
          const result = await prisma.decisionSnapshot.deleteMany({
            where: { id: { in: decisionIds } },
          });
          deletedDecisions += result.count;
        }
      })
    );
  }

  return {
    deletedSnapshots,
    deletedDecisions,
  };
}