export function toCents(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.round(value * 100);
}

export function fromCents(cents: number): number {
  if (!Number.isFinite(cents)) return 0;
  return Math.round(cents) / 100;
}

export function toMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return fromCents(toCents(value));
}

export function addMoney(...values: number[]): number {
  const totalCents = values.reduce((sum, val) => sum + toCents(val), 0);
  return fromCents(totalCents);
}

export function calculateProfit(params: { revenue: number; cost: number }): number {
  const revCents = toCents(params.revenue);
  const costCents = toCents(params.cost);
  return fromCents(revCents - costCents);
}

export function calculateRoiPercent(params: { profit: number; cost: number }): number {
  const costCents = toCents(params.cost);
  if (costCents <= 0) return 0;
  const profitCents = toCents(params.profit);
  return Math.round((profitCents / costCents) * 10000) / 100;
}

export function calculateMarginPercent(params: { profit: number; revenue: number }): number {
  const revenueCents = toCents(params.revenue);
  if (revenueCents <= 0) return 0;
  const profitCents = toCents(params.profit);
  return Math.round((profitCents / revenueCents) * 10000) / 100;
}