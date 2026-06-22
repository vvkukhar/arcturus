// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\brickowl\brickowl-source.ts

import { browserManager } from '../../common/browser-manager';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickowlSearchHtml } from './brickowl-parser';

export async function runBrickOwlSource(specificQuery?: string | null): Promise<void> {
  console.log('[BrickOwlSource] Starting runBrickOwlSource');
  const source = await prisma.marketSource.findUnique({ where: { code: 'brickowl' } });
  
  if (!source || !source.enabled) {
    console.error('[BrickOwlSource] Source not found or disabled');
    return;
  }

  let searchQueries: string[] = [];

  if (specificQuery && specificQuery.trim()) {
    searchQueries = [specificQuery.trim()];
    console.log(`[BrickOwlSource] Using specific query: ${specificQuery}`);
  } else {
    const activeWatchlist = await prisma.watchlistItem.findMany({
      where: { active: true },
      select: { item: { select: { setNumber: true } } }
    });
    searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))) as string[];
    console.log(`[BrickOwlSource] Found ${searchQueries.length} unique set numbers in watchlist`);
  }

  if (searchQueries.length === 0) {
    console.error('[BrickOwlSource] Search queries array is empty');
    return;
  }

  const runId = await startSourceRun('brickowl');
  console.log(`[BrickOwlSource] Created Run ID: ${runId}`);

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const creates: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      console.log(`[BrickOwlSource] Processing query: ${query}`);
      const url = `https://www.brickowl.com/search/catalog?query=${encodeURIComponent(query)}`;
      
      const html = await browserManager.fetchHtml(url, '.ws_item, .category-item');
      const listings = parseBrickowlSearchHtml(html);
      console.log(`[BrickOwlSource] Fetched ${listings.length} listings for query ${query}`);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('brickowl', listing.externalListingId);

        const shippingPrice = listing.shippingPrice ?? estimateUaShippingBySource({
          sourceCode: 'brickowl',
          price: listing.price,
          country: listing.country,
          sealed: listing.sealed,
        });

        creates.push({
          id: listingId,
          sourceId: source.id,
          sourceCode: 'brickowl',
          itemId,
          externalListingId: listing.externalListingId,
          titleRaw: listing.titleRaw,
          url: listing.url,
          imageUrl: listing.imageUrl ?? null,
          price: listing.price || 0,
          currency: listing.currency || 'USD',
          shippingPrice,
          shippingCurrency: listing.shippingCurrency || listing.currency || 'USD',
          condition: listing.condition ?? null,
          sealed: listing.sealed ?? false,
          status: 'active',
          fetchedAt: now,
          updatedAt: now,
        });

        if (resolvedItemId == null) {
          unresolvedOperations.push({
            listingId,
            sourceCode: 'brickowl',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }
      }

      if (creates.length >= 500) {
        console.log(`[BrickOwlSource] Executing raw insert for ${creates.length} items...`);
        await prisma.$executeRaw`
          INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "condition", "sealed", "status", "fetchedAt", "updatedAt")
          SELECT * FROM jsonb_to_recordset(${JSON.stringify(creates)}::jsonb) AS x(
            "id" text, "sourceId" text, "sourceCode" text, "itemId" text, "externalListingId" text, 
            "titleRaw" text, "url" text, "imageUrl" text, "price" float, "currency" text, 
            "shippingPrice" float, "shippingCurrency" text, "condition" text, "sealed" boolean, "status" text, "fetchedAt" timestamp, "updatedAt" timestamp
          )
          ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
            "price" = EXCLUDED."price",
            "shippingPrice" = EXCLUDED."shippingPrice",
            "status" = 'active',
            "fetchedAt" = EXCLUDED."fetchedAt",
            "updatedAt" = EXCLUDED."updatedAt"
        `;
        itemsInserted += creates.length;
        creates.length = 0;
        console.log(`[BrickOwlSource] DB insert complete.`);
      }

      await new Promise((res) => setTimeout(res, 2500 + Math.random() * 3500));
    }

    if (creates.length > 0) {
      console.log(`[BrickOwlSource] Executing final raw insert for ${creates.length} items...`);
      await prisma.$executeRaw`
        INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "condition", "sealed", "status", "fetchedAt", "updatedAt")
        SELECT * FROM jsonb_to_recordset(${JSON.stringify(creates)}::jsonb) AS x(
          "id" text, "sourceId" text, "sourceCode" text, "itemId" text, "externalListingId" text, 
          "titleRaw" text, "url" text, "imageUrl" text, "price" float, "currency" text, 
          "shippingPrice" float, "shippingCurrency" text, "condition" text, "sealed" boolean, "status" text, "fetchedAt" timestamp, "updatedAt" timestamp
        )
        ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
          "price" = EXCLUDED."price",
          "shippingPrice" = EXCLUDED."shippingPrice",
          "status" = 'active',
          "fetchedAt" = EXCLUDED."fetchedAt",
          "updatedAt" = EXCLUDED."updatedAt"
      `;
      itemsInserted += creates.length;
    }

    console.log(`[BrickOwlSource] Enqueueing ${unresolvedOperations.length} unresolved matches...`);
    for (const u of unresolvedOperations) {
      await enqueueUnresolvedMatch(u);
    }

    console.log(`[BrickOwlSource] Run complete. Finishing run logs.`);
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    console.error(`[BrickOwlSource] FATAL ERROR:`, error);
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'brickowl', message: 'BrickOwl source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}