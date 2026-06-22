import * as cheerio from 'cheerio';
import { EbayParsedListing } from './ebay-types';

function parsePrice(raw: string): { amount: number; currency: string } | null {
  // Очищаємо текст: прибираємо HTML-пробіли, замінюємо діапазони "bis", "to" на дефіси
  const cleanRaw = raw.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/to/gi, '-').replace(/bis/gi, '-').trim();
  
  // Шукаємо ПЕРШЕ валідне число (наприклад 15,99 або 1.500,00)
  const numMatch = cleanRaw.match(/(\d{1,3}(?:[.,\s]\d{3})*(?:[.,]\d{1,2})?)/);
  
  if (!numMatch) {
    return null;
  }

  let digits = numMatch[1].replace(/\s/g, '');
  
  // Нормалізація ком і крапок (німецький формат: 1.500,99 -> 1500.99)
  if (digits.includes(',') && digits.includes('.')) {
    if (digits.lastIndexOf(',') > digits.lastIndexOf('.')) {
      digits = digits.replace(/\./g, '').replace(',', '.');
    } else {
      digits = digits.replace(/,/g, '');
    }
  } else if (digits.includes(',')) {
    digits = digits.replace(',', '.');
  }

  const amount = Number(digits);
  if (Number.isNaN(amount) || amount <= 0 || amount > 10000000) {
    return null;
  }

  // Оскільки ми скрапимо ebay.de, дефолтна валюта - Євро
  let currency = 'EUR'; 
  const currUpper = cleanRaw.toUpperCase();
  if (currUpper.includes('$') || currUpper.includes('USD')) currency = 'USD';
  if (currUpper.includes('£') || currUpper.includes('GBP')) currency = 'GBP';
  if (currUpper.includes('UAH') || currUpper.includes('ГРН')) currency = 'UAH';

  return { amount, currency };
}

export function parseEbaySearchHtml(html: string): EbayParsedListing[] {
  console.log(`[EbayParser] Starting HTML parse. HTML length: ${html.length}`);
  const $ = cheerio.load(html);
  const result: EbayParsedListing[] = [];

  const elements = $('.s-item');
  console.log(`[EbayParser] Found ${elements.length} .s-item elements`);

  elements.each((_, element) => {
    const titleElement = $(element).find('.s-item__title');
    let title = titleElement.text().replace(/\s+/g, ' ').trim();
    
    // Прибираємо німецькі приставки для нових лістингів
    title = title.replace(/^Neues Angebot/i, '').replace(/^New Listing/i, '').trim();

    const href = $(element).find('a.s-item__link').attr('href')?.trim() ?? '';
    
    if (!title) return;
    
    // Пропускаємо заголовки секцій (типу "Купуйте ще")
    if (!href || title.toLowerCase().includes('shop on ebay') || title.toLowerCase().includes('weitere artikel')) {
      return;
    }

    const idMatch = href.match(/itm\/(\d+)/);
    const externalListingId = idMatch ? idMatch[1] : href.split('?')[0].split('/').pop() || href;

    const priceText = $(element).find('.s-item__price').text();
    const priceParsed = parsePrice(priceText);
    
    if (!priceParsed) {
      console.log(`[EbayParser] ❌ Rejected Listing (Price Parse Failed): Title: "${title}", Raw Price: "${priceText}"`);
      return;
    }

    const url = href.split('?')[0];

    const imageUrl = $(element).find('.s-item__image-img').attr('src') ?? null;
    
    // На німецькому eBay стан пишеться як "Neu" або "Gebraucht"
    const conditionText = $(element).find('.SECONDARY_INFO').text().toLowerCase();
    const isSealed = conditionText.includes('neu') || conditionText.includes('new') || conditionText.includes('sealed') || conditionText.includes('ovp');

    result.push({
      externalListingId,
      titleRaw: title,
      url,
      imageUrl,
      sellerName: null,
      sellerRating: null,
      price: priceParsed.amount,
      currency: priceParsed.currency,
      shippingPrice: null, // Ми вираховуємо це автоматично в ebay-source.ts
      shippingCurrency: null,
      country: 'DE', // Ставимо Німеччину як джерело
      condition: isSealed ? 'new' : 'used',
      sealed: isSealed,
      completenessPercent: isSealed ? 100 : null,
      quantityAvailable: 1,
    });
  });

  console.log(`[EbayParser] ✅ Successfully parsed ${result.length} valid listings`);
  return result;
}