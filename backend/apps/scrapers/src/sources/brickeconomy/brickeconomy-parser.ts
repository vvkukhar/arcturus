// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\brickeconomy\brickeconomy-parser.ts

import * as cheerio from 'cheerio';
import { BrickeconomyParsedListing } from './brickeconomy-types';

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
    console.error(`[BrickEconomyParser] Failed to match price regex for: "${cleanRaw}"`);
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
    console.error(`[BrickEconomyParser] Invalid amount parsed: ${amount} from "${cleanRaw}"`);
    return null;
  }

  let currency = 'UAH';
  const currUpper = currencyPart.toUpperCase();
  if (currUpper.includes('$')) currency = 'USD';
  if (currUpper.includes('EUR') || currUpper.includes('€')) currency = 'EUR';
  if (currUpper.includes('£')) currency = 'GBP';

  return { amount, currency };
}

export function parseBrickeconomySearchHtml(html: string): BrickeconomyParsedListing[] {
  console.log(`[BrickEconomyParser] Starting HTML parse...`);
  const $ = cheerio.load(html);
  const result: BrickeconomyParsedListing[] = [];
  const seen = new Set<string>();

  const elements = $('.searchlist-item, .row.ItemRow');
  console.log(`[BrickEconomyParser] Found ${elements.length} item elements`);

  elements.each((_, element) => {
    const titleElement = $(element).find('h4 a, h3 a, .title a').first();
    const title = titleElement.text().replace(/\s+/g, ' ').trim();
    const href = titleElement.attr('href')?.trim() ?? '';
    
    if (!title || !href) return;

    const externalListingId = href.split('/').pop() ?? href;
    const priceText = $(element).find('.val-current, .price').text();
    const priceParsed = parsePrice(priceText);
    
    if (!priceParsed) {
      console.warn(`[BrickEconomyParser] Could not parse price for ${title}`);
      return;
    }

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

  console.log(`[BrickEconomyParser] Successfully parsed ${result.length} listings`);
  return result;
}