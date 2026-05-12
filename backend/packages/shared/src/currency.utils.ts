export async function fetchLiveExchangeRates(): Promise<Record<string, number>> {
  const defaultRates: Record<string, number> = { UAH: 1, USD: 41.5, EUR: 45.2, GBP: 52.5, PLN: 10.5 };
  try {
    const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    if (!response.ok) return defaultRates;
    const data = await response.json();
    const rates: Record<string, number> = { UAH: 1 };
    for (const item of data) {
      if (['USD', 'EUR', 'GBP', 'PLN'].includes(item.cc)) {
        rates[item.cc] = item.rate;
      }
    }
    return rates['EUR'] ? rates : defaultRates;
  } catch {
    return defaultRates;
  }
}

export function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0;
  const rateFrom = rates[from.toUpperCase()] || rates['EUR'];
  const rateTo = rates[to.toUpperCase()] || rates['UAH'];
  const baseUah = amount * rateFrom;
  return Number((baseUah / rateTo).toFixed(2));
}