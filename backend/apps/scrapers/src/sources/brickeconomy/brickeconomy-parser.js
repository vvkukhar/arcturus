"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBrickeconomySearchHtml = parseBrickeconomySearchHtml;
const cheerio = __importStar(require("cheerio"));
function parsePrice(raw) {
    const normalized = raw.replace(/\s+/g, ' ').trim();
    if (!normalized)
        return null;
    const digits = normalized.replace(/[^\d.,]/g, '').replace(/\s/g, '').replace(',', '.');
    const amount = Number(digits);
    if (Number.isNaN(amount) || amount <= 0)
        return null;
    const currency = normalized.includes('€') ? 'EUR' : normalized.includes('£') ? 'GBP' : 'USD';
    return { amount, currency };
}
function parseBrickeconomySearchHtml(html) {
    const $ = cheerio.load(html);
    const result = [];
    const seen = new Set();
    $('.searchlist-item').each((_, element) => {
        const titleElement = $(element).find('h4 a');
        const title = titleElement.text().replace(/\s+/g, ' ').trim();
        const href = titleElement.attr('href')?.trim() ?? '';
        if (!title || !href)
            return;
        const externalListingId = href.split('/').pop() ?? href;
        const priceText = $(element).find('.val-current').text();
        const priceParsed = parsePrice(priceText);
        if (!priceParsed)
            return;
        const url = `https://www.brickeconomy.com${href}`;
        if (seen.has(url))
            return;
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
