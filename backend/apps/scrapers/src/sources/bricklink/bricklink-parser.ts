import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const cleanRaw = raw.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

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
  if (rawUrl.startsWith('/')) return `https://www.bricklink.com${rawUrl}`;
  return `https://www.bricklink.com/${rawUrl}`;
}

export function parseBrickLinkSearchHtml(html: string): BrickLinkParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  $('a').each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href || (!href.includes('item.page') && !href.includes('store.asp'))) {
      return;
    }

    const container = $(element).closest('tr, div, li');
    
    // Шукаємо комірку чи блок з валютою
    const priceNodes = container.find('b, strong, td, span').filter(function() {
      const t = $(this).text();
      return t.includes('$') || t.includes('EUR') || t.includes('€') || t.includes('£');
    });

    let priceText = '';
    if (priceNodes.length > 0) {
      priceText = priceNodes.last().text();
    } else {
      priceText = container.text().replace(title, '');
    }

    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = normalizeUrl(href);
    if (seen.has(url)) return;
    seen.add(url);

    const imageUrl = container.find('img').first().attr('src') ?? container.find('img').first().attr('data-src') ?? null;

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