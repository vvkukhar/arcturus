export function toMoney(value: number | null | undefined): number {
  if (value == null || !Number.isFinite(value)) {
    return 0;
  }

  return Number(value.toFixed(2));
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
  revenue: number;
  cost: number;
}): number {
  if (!Number.isFinite(params.revenue) || params.revenue <= 0) {
    return 0;
  }

  return toMoney(((params.revenue - params.cost) / params.revenue) * 100);
}

export function clampMoney(value: number, min = 0): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  return toMoney(Math.max(value, min));
}