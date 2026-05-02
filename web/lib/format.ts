export function formatMoney(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }

  return new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number | null | undefined): string {
  if (value == null || Number.isNaN(value)) {
    return '—';
  }

  return `${value.toFixed(2)}%`;
}