import { prisma } from '../prisma';

class InvertedIndex {
  private index = new Map<string, Set<string>>();
  private idToTitle = new Map<string, string>();

  build(items: { itemId: string; title: string; setNumber: string | null }[]) {
    this.index.clear();
    this.idToTitle.clear();

    for (const item of items) {
      this.idToTitle.set(item.itemId, item.title);
      const tokens = this.tokenize(item.title);
      if (item.setNumber) tokens.add(item.setNumber);

      for (const token of tokens) {
        if (!this.index.has(token)) {
          this.index.set(token, new Set());
        }
        this.index.get(token)!.add(item.itemId);
      }
    }
  }

  tokenize(text: string): Set<string> {
    const tokens = text.toLowerCase().replace(/[^a-z0-9]/g, ' ').split(/\s+/).filter(t => t.length > 2);
    return new Set(tokens);
  }

  findCandidates(query: string): string[] {
    const queryTokens = this.tokenize(query);
    const candidateScores = new Map<string, number>();

    for (const token of queryTokens) {
      const matchSet = this.index.get(token);
      if (matchSet) {
        for (const id of matchSet) {
          candidateScores.set(id, (candidateScores.get(id) || 0) + 1);
        }
      }
    }

    const sorted = Array.from(candidateScores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    return sorted.slice(0, 10);
  }

  getTitle(id: string): string {
    return this.idToTitle.get(id) || '';
  }
}

const watchlistIndex = new InvertedIndex();
const matchCache = new Map<string, string | null>();
let lastCacheTime = 0;

function calculateSimilarity(a: string, b: string): number {
  const aTokens = watchlistIndex.tokenize(a);
  const bTokens = watchlistIndex.tokenize(b);
  if (aTokens.size === 0 || bTokens.size === 0) return 0;
  
  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) intersection++;
  }
  
  const union = new Set([...aTokens, ...bTokens]).size;
  return intersection / union;
}

async function ensureIndexBuilt() {
  if (Date.now() - lastCacheTime < 300000) return;
  
  const data = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { itemId: true, item: { select: { title: true, setNumber: true } } }
  });

  watchlistIndex.build(data.map(d => ({
    itemId: d.itemId,
    title: d.item!.title,
    setNumber: d.item!.setNumber
  })));
  
  lastCacheTime = Date.now();
  matchCache.clear();
}

export async function resolveItemIdFromTitle(titleRaw: string): Promise<string | null> {
  const cacheKey = titleRaw.trim().toLowerCase();
  if (matchCache.has(cacheKey)) return matchCache.get(cacheKey)!;

  await ensureIndexBuilt();

  const normalizedTitle = cacheKey.replace(/[^a-z0-9]/g, ' ');
  const setNumberMatch = normalizedTitle.match(/\b\d{4,5}\b/);

  if (setNumberMatch) {
    const setNumber = setNumberMatch[0];
    const exactMatch = await prisma.item.findFirst({
      where: { setNumber: setNumber },
      select: { id: true }
    });
    if (exactMatch) {
      matchCache.set(cacheKey, exactMatch.id);
      return exactMatch.id;
    }
  }

  const candidates = watchlistIndex.findCandidates(cacheKey);
  
  let bestMatchId: string | null = null;
  let highestRating = 0.55;

  for (const id of candidates) {
    const targetTitle = watchlistIndex.getTitle(id).toLowerCase();
    const rating = calculateSimilarity(normalizedTitle, targetTitle);
    
    if (rating > highestRating) {
      highestRating = rating;
      bestMatchId = id;
    }
  }

  matchCache.set(cacheKey, bestMatchId);
  return bestMatchId;
}