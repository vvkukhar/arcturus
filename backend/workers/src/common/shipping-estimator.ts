export function estimateUaShippingBySource(params: {
  sourceCode: string;
  price?: number | null;
  country?: string | null;
  sealed?: boolean | null;
}): number {
  const source = params.sourceCode.toLowerCase();
  const price = params.price ?? 0;
  const country = (params.country ?? '').toUpperCase();

  if (source === 'olx') {
    if (price <= 500) return 70;
    if (price <= 1500) return 80;
    return 95;
  }

  if (source === 'bricklink') {
    if (country === 'UA') return 120;
    if (country === 'PL') return 260;
    if (country === 'DE') return 320;
    if (country === 'US') return 520;

    if (price <= 1000) return 260;
    if (price <= 3000) return 340;
    return 420;
  }

  if (source === 'brickowl') {
    if (country === 'UA') return 120;
    if (country === 'PL') return 280;
    if (country === 'DE') return 340;
    if (country === 'US') return 540;

    if (price <= 1000) return 280;
    if (price <= 3000) return 360;
    return 440;
  }

  if (source === 'ebay') {
    if (country === 'US') return 560;
    if (country === 'GB') return 420;
    return 460;
  }

  return params.sealed === true ? 120 : 90;
}