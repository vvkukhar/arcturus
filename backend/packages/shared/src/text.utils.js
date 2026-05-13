"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTitle = normalizeTitle;
exports.extractSetNumber = extractSetNumber;
exports.slugify = slugify;
function normalizeTitle(value) {
    return value
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]+/gu, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function extractSetNumber(value) {
    const match = value.match(/\b\d{4,7}\b/);
    return match?.[0] ?? null;
}
function slugify(value) {
    return normalizeTitle(value)
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 120);
}
