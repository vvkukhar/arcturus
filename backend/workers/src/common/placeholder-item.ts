import { prisma } from '../prisma';

export async function getOrCreatePlaceholderItemId(): Promise<string> {
  const existing = await prisma.item.findFirst({
    where: {
      title: 'UNRESOLVED_PLACEHOLDER',
    },
    select: {
      id: true,
    },
  });

  if (existing) {
    return existing.id;
  }

  const created = await prisma.item.create({
    data: {
      kind: 'unknown',
      title: 'UNRESOLVED_PLACEHOLDER',
      conditionDefault: 'unknown',
    },
    select: {
      id: true,
    },
  });

  return created.id;
}