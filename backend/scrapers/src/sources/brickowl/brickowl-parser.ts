import * as cheerio from 'cheerio';
import { BrickowlParsedListing } from './brickowl-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const normalized = raw.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  const digits = normalized.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.');
  const amount = Number(digits);
  if (Number.isNaN(amount) || amount <= 0) return null;
  const currency = normalized.includes('€') ? 'EUR' : normalized.includes('£') ? 'GBP' : 'USD';
  return { amount, currency };
}

export function parseBrickowlSearchHtml(html: string): BrickowlParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickowlParsedListing[] = [];
  const seen = new Set<string>();

  $('.ws_item').each((_, element) => {
    const titleElement = $(element).find('.name a');
    const title = titleElement.text().replace(/\s+/g, ' ').trim();
    const href = titleElement.attr('href')?.trim() ?? '';
    if (!title || !href) return;

    const externalListingId = href.split('/').pop() ?? href;
    const priceText = $(element).find('.price').text();
    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = `https://www.brickowl.com${href}`;
    if (seen.has(url)) return;
    seen.add(url);

    const imageUrl = $(element).find('.image img').attr('src') ?? null;
    const isNew = title.toLowerCase().includes('new');

    result.push({
      externalListingId,
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
      condition: isNew ? 'new' : 'used',
      sealed: isNew,
      completenessPercent: isNew ? 100 : null,
      quantityAvailable: 1,
    });
  });

  return result;
}