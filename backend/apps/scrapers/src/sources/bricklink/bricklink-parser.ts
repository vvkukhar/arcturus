// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\bricklink\bricklink-parser.ts

import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const cleanRaw = raw.replace(/~/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const match = cleanRaw.match(/(US \$|EUR|€|£|GBP|CA \$|AU \$)\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);

  if (!match) return null;

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
  if (Number.isNaN(amount) || amount <= 0 || amount > 500000) return null;

  let currency = 'USD';
  if (currencyPart.includes('EUR') || currencyPart.includes('€')) currency = 'EUR';
  else if (currencyPart.includes('£') || currencyPart.includes('GBP')) currency = 'GBP';
  else if (currencyPart.includes('CA')) currency = 'CAD';
  else if (currencyPart.includes('AU')) currency = 'AUD';

  return { amount, currency };
}

export function parseBrickLinkSearchHtml(html: string): BrickLinkParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  $('tr.item').each((_, element) => {
    const titleElement = $(element).find('strong');
    const title = titleElement.text().replace(/\s+/g, ' ').trim() || 'LEGO Set';
    
    const hrefElement = $(element).find('a[href*="store.asp"]');
    const href = hrefElement.attr('href')?.trim() ?? '';
    if (!href) return;

    const priceText = $(element).find('td').filter((i, el) => $(el).text().includes('$') || $(el).text().includes('EUR')).text();
    const priceParsed = parsePrice(priceText);
    
    if (!priceParsed) return;

    const url = `https://www.bricklink.com${href.startsWith('/') ? href : '/' + href}`;
    if (seen.has(url)) return;
    seen.add(url);

    const conditionText = $(element).text().toLowerCase();
    const isNew = conditionText.includes('new');
    const sealed = isNew && conditionText.includes('sealed');

    result.push({
      externalListingId: href.split('&')[0],
      titleRaw: title,
      url,
      imageUrl: null,
      sellerName: null,
      sellerRating: null,
      price: priceParsed.amount,
      currency: priceParsed.currency,
      shippingPrice: null,
      shippingCurrency: null,
      country: 'EU',
      condition: isNew ? 'new' : 'used',
      sealed,
      completenessPercent: isNew ? 100 : 100,
      quantityAvailable: 1,
    });
  });

  return result;
}