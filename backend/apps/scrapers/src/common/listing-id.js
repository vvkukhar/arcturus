"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stableListingId = stableListingId;
function stableListingId(sourceCode, externalListingId) {
    const encoded = Buffer.from(externalListingId)
        .toString('base64')
        .replaceAll('=', '')
        .replaceAll('+', '-')
        .replaceAll('/', '_');
    return `${sourceCode}_${encoded}`;
}
