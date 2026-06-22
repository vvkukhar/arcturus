// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\ebay\ebay-parser.ts

import * as cheerio from 'cheerio';
import { EbayParsedListing } from './ebay-types';

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
  if (Number.isNaN(amount) || amount <= 0 || amount > 10000000) return null;

  let currency = 'UAH';
  const currUpper = currencyPart.toUpperCase();
  if (currUpper.includes('$')) currency = 'USD';
  if (currUpper.includes('EUR') || currUpper.includes('€')) currency = 'EUR';
  if (currUpper.includes('£')) currency = 'GBP';

  return { amount, currency };
}

export function parseEbaySearchHtml(html: string): EbayParsedListing[] {
  const $ = cheerio.load(html);
  const result: EbayParsedListing[] = [];
  const seen = new Set<string>();

  $('.s-item').each((_, element) => {
    const titleElement = $(element).find('.s-item__title');
    const title = titleElement.text().replace(/\s+/g, ' ').trim();
    const href = $(element).find('a.s-item__link').attr('href')?.trim() ?? '';
    
    if (!title || !href || title.toLowerCase().includes('shop on ebay')) return;

    const idMatch = href.match(/itm\/(\d+)/);
    const externalListingId = idMatch ? idMatch[1] : href.split('?')[0];

    const priceText = $(element).find('.s-item__price').text();
    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = href.split('?')[0];
    if (seen.has(url)) return;
    seen.add(url);

    const imageUrl = $(element).find('.s-item__image-img').attr('src') ?? null;
    const conditionText = $(element).find('.SECONDARY_INFO').text().toLowerCase();
    const isSealed = conditionText.includes('new') || conditionText.includes('sealed');

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
      country: 'US',
      condition: isSealed ? 'new' : 'used',
      sealed: isSealed,
      completenessPercent: isSealed ? 100 : null,
      quantityAvailable: 1,
    });
  });

  return result;
}