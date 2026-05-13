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
exports.parseOlxSearchHtml = parseOlxSearchHtml;
const cheerio = __importStar(require("cheerio"));
function parsePrice(raw) {
    const normalized = raw.replace(/\s+/g, ' ').trim();
    if (!normalized) {
        return null;
    }
    const digits = normalized
        .replace(/[^\d.,]/g, '')
        .replace(/\s/g, '')
        .replace(',', '.');
    const amount = Number(digits);
    if (Number.isNaN(amount) || amount <= 0) {
        return null;
    }
    const currency = normalized.includes('$')
        ? 'USD'
        : normalized.toLowerCase().includes('eur') || normalized.includes('€')
            ? 'EUR'
            : 'UAH';
    return {
        amount,
        currency,
    };
}
function normalizeUrl(rawUrl) {
    if (rawUrl.startsWith('http')) {
        return rawUrl;
    }
    if (rawUrl.startsWith('/')) {
        return `https://www.olx.ua${rawUrl}`;
    }
    return `https://www.olx.ua/${rawUrl}`;
}
function parseOlxSearchHtml(html) {
    const $ = cheerio.load(html);
    const result = [];
    const seen = new Set();
    $('a').each((_, element) => {
        const title = $(element).text().replace(/\s+/g, ' ').trim();
        const href = $(element).attr('href')?.trim() ?? '';
        if (!title || !href) {
            return;
        }
        if (!href.includes('/d/uk/obyavlenie') && !href.includes('/d/obyavlenie')) {
            return;
        }
        const container = $(element).closest('[data-cy], article, div');
        const containerText = container.text() || $(element).parent().text();
        const priceParsed = parsePrice(containerText);
        if (!priceParsed) {
            return;
        }
        const url = normalizeUrl(href);
        if (seen.has(url)) {
            return;
        }
        seen.add(url);
        const imageUrl = container.find('img').first().attr('src') ??
            container.find('img').first().attr('data-src') ??
            null;
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
            country: 'UA',
            condition: null,
            sealed: null,
            completenessPercent: null,
            quantityAvailable: 1,
        });
    });
    return result;
}
