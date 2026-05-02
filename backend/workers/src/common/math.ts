export function toMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(2));
}

export function avg(values: number[]): number | null {
  const clean = values.filter((value) => Number.isFinite(value));

  if (clean.length === 0) {
    return null;
  }

  return toMoney(clean.reduce((sum, value) => sum + value, 0) / clean.length);
}

export function median(values: number[]): number | null {
  const clean = values
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b);

  if (clean.length === 0) {
    return null;
  }

  const mid = Math.floor(clean.length / 2);

  const value =
    clean.length % 2 === 0
      ? (clean[mid - 1] + clean[mid]) / 2
      : clean[mid];

  return toMoney(value);
}

export function calculateProfit(params: {
  revenue: number;
  cost: number;
}): number {
  return toMoney(params.revenue - params.cost);
}

export function calculateRoiPercent(params: {
  profit: number;
  cost: number;
}): number {
  if (!Number.isFinite(params.cost) || params.cost <= 0) {
    return 0;
  }

  return toMoney((params.profit / params.cost) * 100);
}

export function calculateVolatility(values: number[]): number {
  const clean = values.filter((value) => Number.isFinite(value) && value > 0);

  if (clean.length < 2) {
    return 0;
  }

  const average = clean.reduce((sum, value) => sum + value, 0) / clean.length;

  if (average <= 0) {
    return 0;
  }

  const variance =
    clean.reduce((sum, value) => sum + Math.pow(value - average, 2), 0) /
    clean.length;

  const stdDev = Math.sqrt(variance);
  return Number((stdDev / average).toFixed(4));
}