import * as cheerio from 'cheerio';
import { OlxParsedListing } from './olx-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  // 🔥 ГОЛОВНИЙ ФІКС: Шукаємо цифри ТІЛЬКИ поруч із валютою!
  // Це відріже артикули (75192) та кількість деталей (7541) з назви.
  const match = raw.match(/(\d[\d\s.,]*)\s*(грн|UAH|\$|€|eur)/i);

  if (!match) {
    return null;
  }

  const numberPart = match[1];
  const currencyPart = match[2];

  const digits = numberPart
    .replace(/[^\d.,]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');

  const amount = Number(digits);

  if (Number.isNaN(amount) || amount <= 0) {
    return null;
  }

  let currency = 'UAH';
  if (currencyPart.includes('$')) currency = 'USD';
  if (currencyPart.toLowerCase().includes('eur') || currencyPart.includes('€')) currency = 'EUR';

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
    // На OLX назви зазвичай лежать в h6
    const titleElement = $(element).find('h6');
    const title = (titleElement.length > 0 ? titleElement.text() : $(element).text()).replace(/\s+/g, ' ').trim();
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