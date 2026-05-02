export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractSetNumber(value: string): string | null {
  const match = value.match(/\b\d{4,7}\b/);
  return match?.[0] ?? null;
}

export function slugify(value: string): string {
  return normalizeText(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}