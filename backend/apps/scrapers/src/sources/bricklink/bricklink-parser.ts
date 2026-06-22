import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  const cleanRaw = raw.replace(/~/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
  const match = cleanRaw.match(/(US \$|EUR|€|£|GBP|CA \$|AU \$|UAH|SEK|PLN|CZK|DKK|HUF)\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);

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
  if (Number.isNaN(amount) || amount <= 0) return null;

  let currency = 'USD';
  if (currencyPart.includes('EUR') || currencyPart.includes('€')) currency = 'EUR';
  else if (currencyPart.includes('£') || currencyPart.includes('GBP')) currency = 'GBP';
  else if (currencyPart.includes('UAH')) currency = 'UAH';
  else if (currencyPart.includes('SEK')) currency = 'SEK';
  else if (currencyPart.includes('PLN')) currency = 'PLN';
  else if (currencyPart.includes('CZK')) currency = 'CZK';

  return { amount, currency };
}

export function parseBrickLinkSearchHtml(html: string, fallbackTitle: string = 'LEGO Set'): BrickLinkParsedListing[] {
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  const catalogRows = $('table.pcTable tr, table.fv tr').has('a[href*="store.asp"]');
  
  if (catalogRows.length > 0) {
    catalogRows.each((_, el) => {
      const sellerLink = $(el).find('a[href*="store.asp"]').first();
      const href = sellerLink.attr('href') ?? '';
      if (!href) return;
      
      const priceText = $(el).find('td').filter((i, td) => !!$(td).text().match(/\d+/) && $(td).text().match(/(US \$|EUR|€|£|GBP|CA \$|AU \$|UAH|SEK|PLN)/i) !== null).first().text();
      const parsedPrice = parsePrice(priceText);
      if (!parsedPrice) return;

      const descText = $(el).find('td').eq(1).text().toLowerCase();
      const conditionText = $(el).find('td').eq(2).text().toLowerCase();
      
      const isNew = conditionText.includes('new');
      const isSealed = isNew && descText.includes('sealed');
      const isIncomplete = descText.includes('incomplete') || conditionText.includes('incomplete');

      let condition = isNew ? 'new' : 'used';
      if (isIncomplete) condition = 'incomplete';

      const sellerName = sellerLink.text().trim() || 'Unknown';
      const extId = href.split('?')[1] ?? href; 
      const url = href.startsWith('http') ? href : `https://www.bricklink.com${href.startsWith('/') ? '' : '/'}${href}`;

      if (seen.has(url)) return;
      seen.add(url);

      result.push({
        externalListingId: extId,
        titleRaw: fallbackTitle,
        url,
        imageUrl: null,
        sellerName,
        sellerRating: null,
        price: parsedPrice.amount,
        currency: parsedPrice.currency,
        shippingPrice: null,
        shippingCurrency: null,
        country: 'EU',
        condition,
        sealed: isSealed,
        completenessPercent: isIncomplete ? 80 : 100,
        quantityAvailable: 1,
      });
    });
    return result;
  }

  $('a[href*="item.page"]').each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    if (!title || !href) return;
    if (!href.includes('?S=') && !href.includes('?M=')) return;

    const container = $(element).closest('tr, div, li, .ps-item');
    const rowText = container.text().toLowerCase();
    
    const priceNodes = container.find('b, strong, td, span').filter(function() {
      return $(this).text().match(/(US \$|EUR|€|£|GBP|CA \$|AU \$|UAH|SEK|PLN)/i) !== null;
    });

    const priceText = priceNodes.length > 0 ? priceNodes.last().text() : container.text();
    const priceParsed = parsePrice(priceText);
    if (!priceParsed) return;

    const url = href.startsWith('http') ? href : `https://www.bricklink.com${href.startsWith('/') ? '' : '/'}${href}`;
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

  return result;
}