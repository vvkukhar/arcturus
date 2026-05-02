export type CurrencyCode = 'UAH' | 'USD' | 'EUR' | 'GBP' | 'PLN';

const ratesToUah: Record<CurrencyCode, number> = {
  UAH: 1,
  USD: 41.5,
  EUR: 45.2,
  GBP: 52.5,
  PLN: 10.5,
};

export function convertToUah(
  amount: number,
  currency: string | null | undefined,
): number {
  if (!Number.isFinite(amount)) {
    return 0;
  }

  const normalized = (currency ?? 'UAH').toUpperCase() as CurrencyCode;
  const rate = ratesToUah[normalized] ?? 1;

  return Number((amount * rate).toFixed(2));
}