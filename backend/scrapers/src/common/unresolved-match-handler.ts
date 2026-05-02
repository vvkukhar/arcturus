import { prisma } from '../prisma';
import { extractSetNumber, normalizeTitle } from './title-normalizer';

export async function enqueueUnresolvedMatch(params: {
  listingId: string;
  sourceCode: string;
  titleRaw: string;
  suggestedItemId?: string | null;
}): Promise<void> {
  const normalizedTitle = normalizeTitle(params.titleRaw);
  const extractedSetNo = extractSetNumber(params.titleRaw);

  const existing = await prisma.unresolvedMatchQueue.findFirst({
    where: {
      listingId: params.listingId,
      status: 'pending',
    },
  });

  if (existing) {
    return;
  }

  await prisma.unresolvedMatchQueue.create({
    data: {
      listingId: params.listingId,
      sourceCode: params.sourceCode,
      titleRaw: params.titleRaw,
      normalizedTitle,
      extractedSetNo,
      suggestedItemId: params.suggestedItemId ?? null,
      status: 'pending',
    },
  });
}