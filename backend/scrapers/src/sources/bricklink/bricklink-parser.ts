import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const normalized = raw.replace(/\s+/g, ' ').trim();

  if (!normalized) {
    return null;
  }

  const digits = normalized
    .replace(/[^\d.,]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const amount = Number(digits);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  const currency = normalized.includes('$')
    ? 'USD'
    : normalized.toLowerCase().includes('eur') || normalized.includes('€')
      ? 'EUR'
      : 'USD';

  return {
    amount,
    currency,
  };
}

function normalizeUrl(rawUrl: string): string {
  if (rawUrl.startsWith('http')) {
    return rawUrl;
  }

  if (rawUrl.startsWith('/')) {
    return `https://www.bricklink.com${rawUrl}`;
  }

  return `https://www.bricklink.com/${rawUrl}`;
}

export function parseBrickLinkSearchHtml(
  html: string,
): BrickLinkParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  $('a').each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href) {
      return;
    }

    if (!href.includes('item.page') && !href.includes('store.asp')) {
      return;
    }

    const container = $(element).closest('tr, div, li');
    const parentText = container.text() || $(element).parent().text();
    const priceParsed = parsePrice(parentText);

    if (!priceParsed) {
      return;
    }

    const url = normalizeUrl(href);

    if (seen.has(url)) {
      return;
    }

    seen.add(url);

    const imageUrl =
      container.find('img').first().attr('src') ??
      container.find('img').first().attr('data-src') ??
      null;

    result.push({
      externalListingId: href,
      titleRaw: title,
      url,
      imageUrl,
      sellerName: null,
      sellerRating: null,
      price: priceParsed.amount,
      currency: priceParsed.currency,
      shippingPrice: null,
      shippingCurrency: null,
      country: 'EU',
      condition: 'used',
      sealed: false,
      completenessPercent: 100,
      quantityAvailable: 1,
    });
  });

  return result;
}