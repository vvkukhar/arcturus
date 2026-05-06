import { normalizeTitle } from '@arcturus/shared';

// Рекспортуємо базові функції зі спільного пакету, щоб не ламати старі імпорти, 
// яким лінь міняти шлях
export { normalizeTitle, extractSetNumber } from '@arcturus/shared';

// Залишаємо специфічну для workers логіку тут
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