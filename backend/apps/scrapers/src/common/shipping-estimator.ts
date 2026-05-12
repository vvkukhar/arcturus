export function estimateUaShippingBySource(params: {
  sourceCode: string;
  price?: number | null;
  country?: string | null;
  sealed?: boolean | null;
}): number {
  const source = params.sourceCode.toLowerCase();
  const price = params.price ?? 0;

  if (source === 'olx') {
    if (price <= 500) return 70;
    if (price <= 1500) return 80;
    return 95;
  }

  if (source === 'bricklink') {
    if (price <= 1000) return 260;
    if (price <= 3000) return 340;
    return 420;
  }

  if (source === 'brickowl') {
    if (price <= 1000) return 280;
    if (price <= 3000) return 360;
    return 440;
  }

  if (source === 'ebay') {
    if (price <= 1000) return 350;
    if (price <= 3000) return 480;
    return 620;
  }

  return params.sealed === true ? 120 : 90;
}