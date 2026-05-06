import * as cheerio from 'cheerio';
import { OlxParsedListing } from './olx-types';

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
      : 'UAH';

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
    return `https://www.olx.ua${rawUrl}`;
  }

  return `https://www.olx.ua/${rawUrl}`;
}

export function parseOlxSearchHtml(html: string): OlxParsedListing[] {
  const $ = cheerio.load(html);
  const result: OlxParsedListing[] = [];
  const seen = new Set<string>();

  $('a').each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href) {
      return;
    }

    if (!href.includes('/d/uk/obyavlenie') && !href.includes('/d/obyavlenie')) {
      return;
    }

    const container = $(element).closest('[data-cy], article, div');
    const containerText = container.text() || $(element).parent().text();
    const priceParsed = parsePrice(containerText);

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
      country: 'UA',
      condition: null,
      sealed: null,
      completenessPercent: null,
      quantityAvailable: 1,
    });
  });

  return result;
}