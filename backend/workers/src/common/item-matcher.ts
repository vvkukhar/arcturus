import { prisma } from '../prisma';
import {
  extractSetNumber,
  normalizeTitle,
  titleSimilarity,
} from './title-normalizer';

export type MatchResult = {
  itemId: string | null;
  confidence: number;
  reason: string;
};

export async function resolveItemFromTitle(
  rawTitle: string,
): Promise<MatchResult> {
  const setNumber = extractSetNumber(rawTitle);

  if (setNumber) {
    const exact = await prisma.item.findFirst({
      where: {
        setNumber,
      },
      select: {
        id: true,
      },
    });

    if (exact) {
      return {
        itemId: exact.id,
        confidence: 1,
        reason: 'exact_set_number',
      };
    }
  }

  const normalized = normalizeTitle(rawTitle);

  const items = await prisma.item.findMany({
    select: {
      id: true,
      title: true,
      setNumber: true,
    },
    take: 1000,
  });

  let best: {
    itemId: string;
    score: number;
  } | null = null;

  for (const item of items) {
    const normalizedItemTitle = normalizeTitle(item.title);

    if (
      normalized.includes(normalizedItemTitle) ||
      normalizedItemTitle.includes(normalized)
    ) {
      return {
        itemId: item.id,
        confidence: 0.88,
        reason: 'title_contains',
      };
    }

    const score = titleSimilarity(normalized, normalizedItemTitle);

    if (!best || score > best.score) {
      best = {
        itemId: item.id,
        score,
      };
    }
  }

  if (best && best.score >= 0.62) {
    return {
      itemId: best.itemId,
      confidence: best.score,
      reason: 'token_similarity',
    };
  }

  return {
    itemId: null,
    confidence: 0,
    reason: 'unresolved',
  };
}

export async function resolveItemIdFromTitle(
  rawTitle: string,
): Promise<string | null> {
  const result = await resolveItemFromTitle(rawTitle);
  return result.itemId;
}