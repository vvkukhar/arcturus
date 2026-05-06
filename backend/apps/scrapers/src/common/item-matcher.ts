import { prisma } from '../prisma';
import { extractSetNumber, normalizeTitle } from '@arcturus/shared';

export async function resolveItemIdFromTitle(
  rawTitle: string,
): Promise<string | null> {
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
      return exact.id;
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

  for (const item of items) {
    const normalizedItemTitle = normalizeTitle(item.title);

    if (
      normalized.includes(normalizedItemTitle) ||
      normalizedItemTitle.includes(normalized)
    ) {
      return item.id;
    }
  }

  return null;
}