export function stableListingId(sourceCode: string, externalListingId: string): string {
  const encoded = Buffer.from(externalListingId)
    .toString('base64')
    .replaceAll('=', '')
    .replaceAll('+', '-')
    .replaceAll('/', '_');

  return `${sourceCode}_${encoded}`;
}