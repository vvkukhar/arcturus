export function normalizeTitle(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSetNumber(value: string): string | null {
  // Ловить набори (75192) та фіги (njo0012, sw1020, col011a)
  const match = value.match(/\b([a-zA-Z]{2,4}-?\d{2,5}[a-zA-Z]?|\d{4,7})\b/i);
  return match ? match[0].toLowerCase() : null;
}

export function slugify(value: string): string {
  return normalizeTitle(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}