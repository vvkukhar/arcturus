import { prisma } from '../../prisma';
import * as stringSimilarity from 'string-similarity';

export async function resolveItemIdFromTitle(titleRaw: string): Promise<string | null> {
  const normalizedTitle = titleRaw.toLowerCase().replace(/[^a-z0-9]/g, ' ');
  
  const setNumberMatch = normalizedTitle.match(/\b\d{4,5}\b/);
  
  if (setNumberMatch) {
    const setNumber = setNumberMatch[0];
    const exactMatch = await prisma.item.findFirst({
      where: { setNumber: setNumber },
      select: { id: true }
    });
    if (exactMatch) return exactMatch.id;
  }

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { itemId: true, item: { select: { title: true, setNumber: true } } }
  });

  let bestMatchId: string | null = null;
  let highestRating = 0.55; 

  for (const target of activeWatchlist) {
    if (!target.item) continue;
    
    const targetName = target.item.title.toLowerCase();
    const rating = stringSimilarity.compareTwoStrings(normalizedTitle, targetName);
    
    if (rating > highestRating) {
      highestRating = rating;
      bestMatchId = target.itemId;
    }
  }

  return bestMatchId;
}