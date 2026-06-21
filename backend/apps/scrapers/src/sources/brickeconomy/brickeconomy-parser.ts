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