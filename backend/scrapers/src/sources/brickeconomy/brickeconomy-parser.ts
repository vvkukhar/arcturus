import * as cheerio from 'cheerio';
import { BrickeconomyParsedListing } from './brickeconomy-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const normalized = raw.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;
  const digits = normalized.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.');
  const amount = Number(digits);
  if (Number.isNaN(amount) || amount <= 0) return null;
  const currency = normalized.includes('€') ? 'EUR' : normalized.includes('£') ? 'GBP' : 'USD';
  return { amount, currency };
}

export function parseBrickeconomySearchHtml(html: string): BrickeconomyParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickeconomyParsedListing[] = [];
  const seen = new Set<string>();

  $('.searchlist-item').each((_, element) => {
    const titleElement = $(element).find('h4 a');
    const title = titleElement.text().replace(/\s+/g, ' ').trim();
    const href = titleElement.attr('href')?.trim() ?? '';
    if (!title || !href) return;

    const externalListingId = href.split('/').pop() ?? href;
    const priceText = $(element).find('.val-current').text();
    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = `https://www.brickeconomy.com${href}`;
    if (seen.has(url)) return;
    seen.add(url);

    result.push({
      externalListingId,
      titleRaw: title,
      url,
      imageUrl: null,
      price: priceParsed.amount,
      currency: priceParsed.currency,
    });
  });

  return result;
}