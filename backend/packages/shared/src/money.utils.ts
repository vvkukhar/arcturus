export function toMoney(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Number(value.toFixed(2));
}

export function addMoney(...values: number[]): number {
  return toMoney(
    values.reduce((sum, value) => sum + Number(value ?? 0), 0),
  );
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

export function calculateMarginPercent(params: {
  profit: number;
  revenue: number;
}): number {
  if (!Number.isFinite(params.revenue) || params.revenue <= 0) {
    return 0;
  }
  return toMoney((params.profit / params.revenue) * 100);
}