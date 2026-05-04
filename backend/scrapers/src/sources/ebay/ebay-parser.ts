import * as cheerio from 'cheerio';
import { EbayParsedListing } from './ebay-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const normalized = raw.replace(/\s+/g, ' ').trim();
  if (!normalized) return null;

  const digits = normalized.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.');
  const amount = Number(digits);

  if (Number.isNaN(amount) || amount <= 0) return null;

  const currency = normalized.includes('£') ? 'GBP' : normalized.includes('€') ? 'EUR' : 'USD';

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