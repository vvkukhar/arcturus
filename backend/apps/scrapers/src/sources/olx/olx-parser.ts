import * as cheerio from 'cheerio';
import { OlxParsedListing } from './olx-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const cleanRaw = raw.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  // Шукаємо число, до якого жорстко прив'язана валюта (до або після)
  const matchAfter = cleanRaw.match(/(\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)\s*(грн|UAH|EUR|€|\$|£)/i);
  const matchBefore = cleanRaw.match(/(\$|€|£|EUR)\s*(\d{1,3}(?:[\s.,]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);

  let numberPart = '';
  let currencyPart = '';

  if (matchAfter) {
    numberPart = matchAfter[1];
    currencyPart = matchAfter[2];
  } else if (matchBefore) {
    currencyPart = matchBefore[1];
    numberPart = matchBefore[2];
  } else {
    return null;
  }

  const digits = numberPart.replace(/[^\d.,]/g, '');

  let normalizedDigits = digits;
  if (digits.includes(',') && digits.includes('.')) {
    if (digits.lastIndexOf(',') > digits.lastIndexOf('.')) {
      normalizedDigits = digits.replace(/\./g, '').replace(',', '.');
    } else {
      normalizedDigits = digits.replace(/,/g, '');
    }
  } else if (digits.includes(',')) {
    const parts = digits.split(',');
    if (parts[parts.length - 1].length <= 2) {
      normalizedDigits = digits.replace(',', '.');
    } else {
      normalizedDigits = digits.replace(/,/g, '');
    }
  }

  const amount = Number(normalizedDigits);

  // Захист від сміття (якщо парсер все ж зловив злитий артикул на 10+ мільйонів)
  if (Number.isNaN(amount) || amount <= 0 || amount > 10000000) {
    return null;
  }

  let currency = 'UAH';
  const currUpper = currencyPart.toUpperCase();
  if (currUpper.includes('$')) currency = 'USD';
  if (currUpper.includes('EUR') || currUpper.includes('€')) currency = 'EUR';
  if (currUpper.includes('£')) currency = 'GBP';

  return { amount, currency };
}

function normalizeUrl(rawUrl: string): string {
  if (rawUrl.startsWith('http')) return rawUrl;
  if (rawUrl.startsWith('/')) return `https://www.olx.ua${rawUrl}`;
  return `https://www.olx.ua/${rawUrl}`;
}

export function parseOlxSearchHtml(html: string): OlxParsedListing[] {
  const $ = cheerio.load(html);
  const result: OlxParsedListing[] = [];
  const seen = new Set<string>();

  $('a').each((_, element) => {
    const titleElement = $(element).find('h6');
    const rawTitleText = titleElement.length > 0 ? titleElement.text() : $(element).text();
    const title = rawTitleText.replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href || (!href.includes('/d/uk/obyavlenie') && !href.includes('/d/obyavlenie'))) {
      return;
    }

    const priceElement = $(element).find('[data-testid="ad-price"]');
    let priceText = '';
    
    if (priceElement.length > 0) {
      priceText = priceElement.text();
    } else {
      const container = $(element).closest('[data-cy="l-card"], article, div');
      priceText = (container.text() || $(element).parent().text()).replace(rawTitleText, '');
    }

    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = normalizeUrl(href);
    if (seen.has(url)) return;
    seen.add(url);

    const containerForImg = $(element).closest('[data-cy="l-card"], article, div');
    const imageUrl = containerForImg.find('img').first().attr('src') ?? containerForImg.find('img').first().attr('data-src') ?? null;

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