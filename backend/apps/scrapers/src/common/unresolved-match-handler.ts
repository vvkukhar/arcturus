import { prisma } from '../prisma';

export interface UnresolvedMatchPayload {
  listingId: string;
  sourceCode: string;
  titleRaw: string;
}

export async function enqueueUnresolvedMatch(payload: UnresolvedMatchPayload): Promise<void> {
  const existing = await prisma.unresolvedMatchQueue.findFirst({
    where: { listingId: payload.listingId }
  });

  if (existing) {
    await prisma.unresolvedMatchQueue.update({
      where: { id: existing.id },
      data: {
        titleRaw: payload.titleRaw,
        updatedAt: new Date(),
      },
    });
  } else {
    await prisma.unresolvedMatchQueue.create({
      data: {
        listingId: payload.listingId,
        sourceCode: payload.sourceCode,
        titleRaw: payload.titleRaw,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'pending'
      }
    });
  }
}