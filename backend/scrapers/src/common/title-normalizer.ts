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