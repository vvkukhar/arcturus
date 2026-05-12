import { prisma } from '../../prisma';

export interface UnresolvedMatchPayload {
  listingId: string;
  sourceCode: string;
  titleRaw: string;
}

export async function enqueueUnresolvedMatch(payload: UnresolvedMatchPayload): Promise<void> {
  await prisma.unresolvedListing.upsert({
    where: { listingId: payload.listingId },
    update: {
      titleRaw: payload.titleRaw,
      lastSeenAt: new Date(),
      attempts: { increment: 1 }
    },
    create: {
      listingId: payload.listingId,
      sourceCode: payload.sourceCode,
      titleRaw: payload.titleRaw,
      firstSeenAt: new Date(),
      lastSeenAt: new Date(),
      attempts: 1,
      status: 'pending'
    }
  });
}