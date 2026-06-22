// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\bricklink\bricklink-parser.ts

import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const cleanRaw = raw.replace(/~/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const match = cleanRaw.match(/(US \$|EUR|€|£|GBP|CA \$|AU \$)\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);

  if (!match) {
    console.error(`[BrickLinkParser] Failed to match price regex for: "${cleanRaw}"`);
    return null;
  }

  const currencyPart = match[1].toUpperCase();
  const numberPart = match[2];

  let digits = numberPart.replace(/\s/g, '');
  if (digits.includes(',') && digits.includes('.')) {
     if (digits.lastIndexOf(',') > digits.lastIndexOf('.')) {
       digits = digits.replace(/\./g, '').replace(',', '.');
     } else {
       digits = digits.replace(/,/g, '');
     }
  } else {
     digits = digits.replace(',', '.');
  }

  const amount = Number(digits);
  if (Number.isNaN(amount) || amount <= 0 || amount > 500000) {
    console.error(`[BrickLinkParser] Invalid amount parsed: ${amount} from "${cleanRaw}"`);
    return null;
  }

  let currency = 'USD';
  if (currencyPart.includes('EUR') || currencyPart.includes('€')) currency = 'EUR';
  else if (currencyPart.includes('£') || currencyPart.includes('GBP')) currency = 'GBP';
  else if (currencyPart.includes('CA')) currency = 'CAD';
  else if (currencyPart.includes('AU')) currency = 'AUD';

  return { amount, currency };
}

function normalizeUrl(rawUrl: string): string {
  if (rawUrl.startsWith('http')) return rawUrl;
  if (rawUrl.startsWith('/')) return `https://www.bricklink.com${rawUrl}`;
  return `https://www.bricklink.com/${rawUrl}`;
}

export function parseBrickLinkSearchHtml(html: string): BrickLinkParsedListing[] {
  console.log(`[BrickLinkParser] Starting HTML parse...`);
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  const anchors = $('a');
  console.log(`[BrickLinkParser] Found ${anchors.length} anchor tags`);

  anchors.each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href || (!href.includes('item.page') && !href.includes('store.asp'))) return;
    if (!href.includes('?S=') && !href.includes('?M=')) return;

    const container = $(element).closest('tr, div, li, .ps-item');
    const rowText = container.text().toLowerCase();
    
    const priceNodes = container.find('b, strong, td, span').filter(function() {
      const t = $(this).text();
      return t.includes('$') || t.includes('EUR') || t.includes('€') || t.includes('£');
    });

    let priceText = '';
    if (priceNodes.length > 0) {
      priceText = priceNodes.last().text();
    } else {
      priceText = container.text();
    }

    const priceParsed = parsePrice(priceText);
    if (!priceParsed) {
      console.warn(`[BrickLinkParser] Could not parse price for ${title}`);
      return;
    }

    const url = normalizeUrl(href);
    if (seen.has(url)) return;
    seen.add(url);

    const imageUrl = container.find('img').first().attr('src') ?? container.find('img').first().attr('data-src') ?? null;
    const isNew = rowText.includes('new');
    const isIncomplete = rowText.includes('incomplete');
    let condition = isNew ? 'new' : 'used';
    if (isIncomplete) condition = 'incomplete';
    const sealed = isNew && rowText.includes('sealed');

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
      condition,
      sealed,
      completenessPercent: isIncomplete ? 80 : 100,
      quantityAvailable: 1,
    });
  });

  console.log(`[BrickLinkParser] Successfully parsed ${result.length} listings`);
  return result;
}