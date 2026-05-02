export type FreshnessLabel =
  | 'missing'
  | 'fresh'
  | 'recent'
  | 'aging'
  | 'stale'
  | 'very_stale';

export function getFreshnessLabel(date: Date | null | undefined): FreshnessLabel {
  if (!date) {
    return 'missing';
  }

  const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);

  if (diffHours <= 6) return 'fresh';
  if (diffHours <= 24) return 'recent';
  if (diffHours <= 72) return 'aging';
  if (diffHours <= 168) return 'stale';

  return 'very_stale';
}

export function getFreshnessScore(date: Date | null | undefined): number {
  const label = getFreshnessLabel(date);

  if (label === 'fresh') return 1;
  if (label === 'recent') return 0.82;
  if (label === 'aging') return 0.55;
  if (label === 'stale') return 0.3;
  if (label === 'very_stale') return 0.12;

  return 0;
}