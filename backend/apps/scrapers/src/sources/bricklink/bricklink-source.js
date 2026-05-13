"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBrickLinkSource = runBrickLinkSource;
const browser_manager_1 = require("../../common/browser-manager");
const shipping_estimator_1 = require("../../common/shipping-estimator");
const item_matcher_1 = require("../../common/item-matcher");
const listing_id_1 = require("../../common/listing-id");
const source_error_logger_1 = require("../../common/source-error-logger");
const source_run_logger_1 = require("../../common/source-run-logger");
const unresolved_match_handler_1 = require("../../common/unresolved-match-handler");
const placeholder_item_1 = require("../../common/placeholder-item");
const prisma_1 = require("../../prisma");
const bricklink_parser_1 = require("./bricklink-parser");
async function runBrickLinkSource() {
    const source = await prisma_1.prisma.marketSource.findUnique({ where: { code: 'bricklink' } });
    if (!source || !source.enabled)
        return;
    const activeWatchlist = await prisma_1.prisma.watchlistItem.findMany({
        where: { active: true },
        select: { item: { select: { setNumber: true } } }
    });
    const searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean)));
    if (searchQueries.length === 0)
        return;
    const runId = await (0, source_run_logger_1.startSourceRun)('bricklink');
    let itemsSeen = 0;
    let itemsMatched = 0;
    let itemsInserted = 0;
    let itemsUpdated = 0;
    try {
        const upsertOperations = [];
        const unresolvedOperations = [];
        const now = new Date();
        for (const query of searchQueries) {
            const url = `https://www.bricklink.com/v2/search.page?q=${encodeURIComponent(query)}#T=S`;
            const html = await browser_manager_1.browserManager.fetchHtml(url);
            const listings = (0, bricklink_parser_1.parseBrickLinkSearchHtml)(html);
            for (const listing of listings) {
                itemsSeen += 1;
                const resolvedItemId = await (0, item_matcher_1.resolveItemIdFromTitle)(listing.titleRaw);
                const itemId = resolvedItemId ?? (await (0, placeholder_item_1.getOrCreatePlaceholderItemId)());
                const listingId = (0, listing_id_1.stableListingId)('bricklink', listing.externalListingId);
                const shippingPrice = listing.shippingPrice ?? (0, shipping_estimator_1.estimateUaShippingBySource)({
                    sourceCode: 'bricklink',
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
                        currency: listing.currency,
                        shippingPrice,
                        shippingCurrency: listing.shippingCurrency ?? listing.currency ?? 'USD',
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
                        currency: listing.currency,
                        shippingPrice,
                        shippingCurrency: listing.shippingCurrency ?? listing.currency ?? 'USD',
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
                        sourceCode: 'bricklink',
                        titleRaw: listing.titleRaw,
                    });
                }
                else {
                    itemsMatched += 1;
                }
            }
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
        await (0, source_error_logger_1.logSourceError)({ scope: 'scraper', sourceCode: 'bricklink', message: 'BrickLink source failed', detailsJson: { error: message } });
        await (0, source_run_logger_1.finishSourceRun)({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
    }
}
