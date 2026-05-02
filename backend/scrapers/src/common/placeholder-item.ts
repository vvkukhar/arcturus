import { prisma } from '../prisma';

export async function getOrCreatePlaceholderItemId(): Promise<string> {
  const placeholder = await prisma.item.upsert({
    where: {
      id: 'item_unresolved_placeholder',
    },
    update: {},
    create: {
      id: 'item_unresolved_placeholder',
      kind: 'unknown',
      title: 'UNRESOLVED_PLACEHOLDER',
      conditionDefault: 'unknown',
    },
    select: {
      id: true,
    },
  });

  return placeholder.id;
}