"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBrickOwlSource = runBrickOwlSource;
const http_client_1 = require("../../common/http-client");
const shipping_estimator_1 = require("../../common/shipping-estimator");
const item_matcher_1 = require("../../common/item-matcher");
const listing_id_1 = require("../../common/listing-id");
const source_error_logger_1 = require("../../common/source-error-logger");
const source_run_logger_1 = require("../../common/source-run-logger");
const unresolved_match_handler_1 = require("../../common/unresolved-match-handler");
const placeholder_item_1 = require("../../common/placeholder-item");
const prisma_1 = require("../../prisma");
const brickowl_parser_1 = require("./brickowl-parser");
async function runBrickOwlSource() {
    const source = await prisma_1.prisma.marketSource.findUnique({ where: { code: 'brickowl' } });
    if (!source || !source.enabled)
        return;
    const activeWatchlist = await prisma_1.prisma.watchlistItem.findMany({
        where: { active: true },
        select: { item: { select: { setNumber: true } } }
    });
    const searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean)));
    if (searchQueries.length === 0)
        return;
    const runId = await (0, source_run_logger_1.startSourceRun)('brickowl');
    let itemsSeen = 0;
    let itemsMatched = 0;
    let itemsInserted = 0;
    let itemsUpdated = 0;
    try {
        const upsertOperations = [];
        const unresolvedOperations = [];
        const now = new Date();
        for (const query of searchQueries) {
            const url = `https://www.brickowl.com/search/catalog?query=${encodeURIComponent(query)}`;
            const response = await http_client_1.httpClient.get(url);
            const listings = (0, brickowl_parser_1.parseBrickowlSearchHtml)(response.data);
            for (const listing of listings) {
                itemsSeen += 1;
                const resolvedItemId = await (0, item_matcher_1.resolveItemIdFromTitle)(listing.titleRaw);
                const itemId = resolvedItemId ?? (await (0, placeholder_item_1.getOrCreatePlaceholderItemId)());
                const listingId = (0, listing_id_1.stableListingId)('brickowl', listing.externalListingId);
                const shippingPrice = listing.shippingPrice ?? (0, shipping_estimator_1.estimateUaShippingBySource)({
                    sourceCode: 'brickowl',
                    price: listing.price,
                    country: listing.country,
                    sealed: listing.sealed,
                });
                upsertOperations.push(prisma_1.prisma.marketListing.upsert({
                    where: { id: listingId },
                    update: {
                        sourceCode: source.code,
                        itemId,
                        titleRaw: listing.titleRaw,
                        title: listing.titleRaw,
                        url: listing.url,
                        imageUrl: listing.imageUrl,
                        price: listing.price,
                        currency: listing.currency ?? 'USD',
                        shippingPrice,
                        shippingCurrency: listing.shippingCurrency ?? 'USD',
                        condition: listing.condition,
                        sealed: listing.sealed,
                        status: 'active',
                        fetchedAt: now,
                        lastSeenAt: now,
                    },
                    create: {
                        id: listingId,
                        sourceId: source.id,
                        sourceCode: source.code,
                        itemId,
                        externalListingId: listing.externalListingId,
                        externalId: listing.externalListingId,
                        titleRaw: listing.titleRaw,
                        title: listing.titleRaw,
                        url: listing.url,
                        imageUrl: listing.imageUrl,
                        price: listing.price,
                        currency: listing.currency ?? 'USD',
                        shippingPrice,
                        shippingCurrency: listing.shippingCurrency ?? 'USD',
                        condition: listing.condition,
                        sealed: listing.sealed,
                        status: 'active',
                        fetchedAt: now,
                        firstSeenAt: now,
                        lastSeenAt: now,
                    },
                }));
                if (resolvedItemId == null) {
                    unresolvedOperations.push({
                        listingId,
                        sourceCode: 'brickowl',
                        titleRaw: listing.titleRaw,
                    });
                }
                else {
                    itemsMatched += 1;
                }
            }
            await new Promise((res) => setTimeout(res, 2500 + Math.random() * 3500));
        }
        if (upsertOperations.length > 0) {
            const chunkSize = 100;
            for (let i = 0; i < upsertOperations.length; i += chunkSize) {
                const chunk = upsertOperations.slice(i, i + chunkSize);
                await prisma_1.prisma.$transaction(chunk);
                itemsInserted += chunk.length;
            }
        }
        for (const u of unresolvedOperations) {
            await (0, unresolved_match_handler_1.enqueueUnresolvedMatch)(u);
        }
        await (0, source_run_logger_1.finishSourceRun)({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await (0, source_error_logger_1.logSourceError)({ scope: 'scraper', sourceCode: 'brickowl', message: 'BrickOwl source failed', detailsJson: { error: message } });
        await (0, source_run_logger_1.finishSourceRun)({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
    }
}
