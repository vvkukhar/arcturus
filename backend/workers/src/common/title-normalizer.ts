export function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSetNumber(value: string): string | null {
  const match = value.match(/\b\d{4,7}\b/);
  return match ? match[0] : null;
}

export function titleTokens(value: string): string[] {
  return normalizeTitle(value)
    .split(' ')
    .map((x) => x.trim())
    .filter((x) => x.length >= 2);
}

export function titleSimilarity(a: string, b: string): number {
  const aTokens = new Set(titleTokens(a));
  const bTokens = new Set(titleTokens(b));

  if (aTokens.size === 0 || bTokens.size === 0) {
    return 0;
  }

  let intersection = 0;

  for (const token of aTokens) {
    if (bTokens.has(token)) {
      intersection += 1;
    }
  }

  const union = new Set([...aTokens, ...bTokens]).size;
  return Number((intersection / union).toFixed(4));
}