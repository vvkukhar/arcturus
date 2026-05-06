import { prisma } from '../prisma';
import { extractSetNumber, normalizeTitle } from '@arcturus/shared';

export async function enqueueUnresolvedMatch(params: {
  listingId: string;
  sourceCode: string;
  titleRaw: string;
  suggestedItemId?: string | null;
  confidence?: number | null;
  reason?: string | null;
}): Promise<void> {
  const normalizedTitle = normalizeTitle(params.titleRaw);
  const extractedSetNo = extractSetNumber(params.titleRaw);

  const existing = await prisma.unresolvedMatchQueue.findFirst({
    where: {
      listingId: params.listingId,
      status: 'pending',
    },
  });

  const resolutionNote =
    params.reason || params.confidence != null
      ? `Auto match: ${params.reason ?? 'unresolved'} / confidence ${
          params.confidence ?? 0
        }`
      : undefined;

  if (existing) {
    await prisma.unresolvedMatchQueue.update({
      where: {
        id: existing.id,
      },
      data: {
        normalizedTitle,
        extractedSetNo,
        suggestedItemId: params.suggestedItemId ?? existing.suggestedItemId,
        resolutionNote: resolutionNote ?? existing.resolutionNote,
      },
    });

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
      resolutionNote: resolutionNote ?? null,
      status: 'pending',
    },
  });
}