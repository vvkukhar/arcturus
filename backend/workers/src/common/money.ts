export function toMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(2));
}

export function avg(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return toMoney(values.reduce((sum, value) => sum + value, 0) / values.length);
}

export function median(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);

  const value =
    sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];

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