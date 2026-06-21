import * as cheerio from 'cheerio';
import { BrickLinkParsedListing } from './bricklink-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  // Очищаємо від HTML-пробілів та символу "~" (Bricklink часто пише ~US $15.00)
  const cleanRaw = raw.replace(/~/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  // Регулярка суто під формат Bricklink: Валюта + Пробіл + Число
  // Наприклад: US $15.50, EUR 120.00, £ 45.00
  const match = cleanRaw.match(/(US \$|EUR|€|£|GBP|CA \$|AU \$)\s*(\d{1,3}(?:[,.\s]\d{3})*(?:[.,]\d{1,2})?|\d+(?:[.,]\d{1,2})?)/i);

  if (!match) return null;

  const currencyPart = match[1].toUpperCase();
  const numberPart = match[2];

  // Нормалізуємо число (1,000.50 -> 1000.50 або 15,50 -> 15.50)
  let digits = numberPart.replace(/\s/g, '');
  if (digits.includes(',') && digits.includes('.')) {
     digits = digits.replace(/,/g, '');
  } else {
     digits = digits.replace(',', '.');
  }

  const amount = Number(digits);

  // Запобіжник від мільярдів
  if (Number.isNaN(amount) || amount <= 0 || amount > 500000) {
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
  const $ = cheerio.load(html);
  const result: BrickLinkParsedListing[] = [];
  const seen = new Set<string>();

  $('a').each((_, element) => {
    const title = $(element).text().replace(/\s+/g, ' ').trim();
    const href = $(element).attr('href')?.trim() ?? '';

    // 1. Беремо тільки лінки на товари
    if (!title || !href || !href.includes('item.page')) {
      return;
    }

    // 🔥 АНТИ-СМІТТЯ ФІКС: Пропускаємо наклейки (?P=), коробки (?O=), інструкції (?I=)
    // Дозволяємо тільки Сети (?S=) та Мініфігурки (?M=)
    if (!href.includes('?S=') && !href.includes('?M=')) {
      return;
    }

    const container = $(element).closest('tr, div, li');
    const rowText = container.text().toLowerCase();
    
    // Шукаємо ціну точково
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
    if (!priceParsed) return;

    const url = normalizeUrl(href);
    if (seen.has(url)) return;
    seen.add(url);

    const imageUrl = container.find('img').first().attr('src') ?? container.find('img').first().attr('data-src') ?? null;

    // Визначаємо стан
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