"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBrickEconomySource = runBrickEconomySource;
const http_client_1 = require("../../common/http-client");
const item_matcher_1 = require("../../common/item-matcher");
const listing_id_1 = require("../../common/listing-id");
const source_error_logger_1 = require("../../common/source-error-logger");
const source_run_logger_1 = require("../../common/source-run-logger");
const placeholder_item_1 = require("../../common/placeholder-item");
const prisma_1 = require("../../prisma");
const brickeconomy_parser_1 = require("./brickeconomy-parser");
async function runBrickEconomySource() {
    const source = await prisma_1.prisma.marketSource.findUnique({ where: { code: 'brickeconomy' } });
    if (!source || !source.enabled)
        return;
    const activeWatchlist = await prisma_1.prisma.watchlistItem.findMany({
        where: { active: true },
        select: { item: { select: { setNumber: true } } }
    });
    const searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean)));
    if (searchQueries.length === 0)
        return;
    const runId = await (0, source_run_logger_1.startSourceRun)('brickeconomy');
    let itemsSeen = 0;
    let itemsMatched = 0;
    let itemsInserted = 0;
    let itemsUpdated = 0;
    try {
        const upsertOperations = [];
        const now = new Date();
        for (const query of searchQueries) {
            const url = `https://www.brickeconomy.com/search?query=${encodeURIComponent(query)}`;
            const response = await http_client_1.httpClient.get(url);
            const marketData = (0, brickeconomy_parser_1.parseBrickeconomySearchHtml)(response.data);
            for (const data of marketData) {
                itemsSeen += 1;
                const resolvedItemId = await (0, item_matcher_1.resolveItemIdFromTitle)(data.titleRaw);
                const itemId = resolvedItemId ?? (await (0, placeholder_item_1.getOrCreatePlaceholderItemId)());
                const listingId = (0, listing_id_1.stableListingId)('brickeconomy', data.externalListingId);
                upsertOperations.push(prisma_1.prisma.marketListing.upsert({
                    where: { id: listingId },
                    update: {
                        sourceCode: source.code,
                        itemId,
                        titleRaw: data.titleRaw,
                        title: data.titleRaw,
                        url: data.url,
                        price: data.price,
                        currency: data.currency ?? 'USD',
                        condition: 'newSealed',
                        sealed: true,
                        status: 'active',
                        fetchedAt: now,
                        lastSeenAt: now,
                    },
                    create: {
                        id: listingId,
                        sourceId: source.id,
                        sourceCode: source.code,
                        itemId,
                        externalListingId: data.externalListingId,
                        externalId: data.externalListingId,
                        titleRaw: data.titleRaw,
                        title: data.titleRaw,
                        url: data.url,
                        price: data.price,
                        currency: data.currency ?? 'USD',
                        condition: 'newSealed',
                        sealed: true,
                        status: 'active',
                        fetchedAt: now,
                        firstSeenAt: now,
                        lastSeenAt: now,
                    },
                }));
                if (resolvedItemId != null) {
                    itemsMatched += 1;
                }
            }
            await new Promise((res) => setTimeout(res, 3000 + Math.random() * 3000));
        }
        if (upsertOperations.length > 0) {
            const chunkSize = 100;
            for (let i = 0; i < upsertOperations.length; i += chunkSize) {
                const chunk = upsertOperations.slice(i, i + chunkSize);
                await prisma_1.prisma.$transaction(chunk);
                itemsInserted += chunk.length;
            }
        }
        await (0, source_run_logger_1.finishSourceRun)({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        await (0, source_error_logger_1.logSourceError)({ scope: 'scraper', sourceCode: 'brickeconomy', message: 'BrickEconomy source failed', detailsJson: { error: message } });
        await (0, source_run_logger_1.finishSourceRun)({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
    }
}
