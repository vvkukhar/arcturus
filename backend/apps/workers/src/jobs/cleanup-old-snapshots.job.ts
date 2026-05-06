import { prisma } from '../prisma';

export async function cleanupOldSnapshotsJob(params?: { keepPerItem?: number }): Promise<{ deletedSnapshots: number; deletedDecisions: number }> {
  const keepPerItem = params?.keepPerItem ?? 30;

  const deletedSnapshots = await prisma.$executeRaw`
    DELETE FROM "MarketSnapshot"
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER(PARTITION BY "itemId" ORDER BY "computedAt" DESC) as rn
        FROM "MarketSnapshot"
      ) sub
      WHERE rn > ${keepPerItem}
    );
  `;

  const deletedDecisions = await prisma.$executeRaw`
    DELETE FROM "DecisionSnapshot"
    WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER(PARTITION BY "itemId" ORDER BY "createdAt" DESC) as rn
        FROM "DecisionSnapshot"
      ) sub
      WHERE rn > ${keepPerItem}
    );
  `;

  return {
    deletedSnapshots,
    deletedDecisions,
  };
}