// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\ebay\ebay-source.ts

import { browserManager } from '../../common/browser-manager';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseEbaySearchHtml } from './ebay-parser';

export async function runEbaySource(specificQuery?: string | null): Promise<void> {
  console.log('[EbaySource] Starting runEbaySource');
  const source = await prisma.marketSource.findUnique({ where: { code: 'ebay' } });
  
  if (!source || !source.enabled) {
    console.error('[EbaySource] Source not found or disabled');
    return;
  }

  let searchQueries: string[] = [];

  if (specificQuery && specificQuery.trim()) {
    searchQueries = [specificQuery.trim()];
    console.log(`[EbaySource] Using specific query: ${specificQuery}`);
  } else {
    const activeWatchlist = await prisma.watchlistItem.findMany({
      where: { active: true },
      select: { item: { select: { setNumber: true } } }
    });
    searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))) as string[];
    console.log(`[EbaySource] Found ${searchQueries.length} unique set numbers in watchlist`);
  }

  if (searchQueries.length === 0) {
    console.error('[EbaySource] Search queries array is empty');
    return;
  }

  const runId = await startSourceRun('ebay');
  console.log(`[EbaySource] Created Run ID: ${runId}`);

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const upsertOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      console.log(`[EbaySource] Processing query: ${query}`);
      const url = `https://www.ebay.com/sch/i.html?_nkw=lego+${encodeURIComponent(query)}&_sacat=0`;
      
      const html = await browserManager.fetchHtml(url, '.s-item');
      const listings = parseEbaySearchHtml(html);
      console.log(`[EbaySource] Fetched ${listings.length} listings for query ${query}`);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('ebay', listing.externalListingId);

        const shippingPrice = listing.shippingPrice ?? estimateUaShippingBySource({
          sourceCode: 'ebay',
          price: listing.price,
          country: listing.country,
          sealed: listing.sealed,
        });

        upsertOperations.push(
          prisma.marketListing.upsert({
            where: { id: listingId },
            update: {
              price: listing.price || 0,
              shippingPrice,
              status: 'active',
              fetchedAt: now,
              updatedAt: now,
            },
            create: {
              id: listingId,
              sourceId: source.id,
              sourceCode: 'ebay',
              itemId,
              externalListingId: listing.externalListingId,
              externalId: listing.externalListingId,
              titleRaw: listing.titleRaw,
              title: listing.titleRaw,
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
              firstSeenAt: now,
              lastSeenAt: now,
            }
          })
        );

        if (resolvedItemId == null) {
          unresolvedOperations.push({
            listingId,
            sourceCode: 'ebay',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }
      }
    }

    console.log(`[EbaySource] Executing ${upsertOperations.length} DB upsert operations...`);
    if (upsertOperations.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < upsertOperations.length; i += chunkSize) {
        const chunk = upsertOperations.slice(i, i + chunkSize);
        await prisma.$transaction(chunk);
        itemsInserted += chunk.length;
      }
    }
    console.log(`[EbaySource] DB upserts complete.`);

    console.log(`[EbaySource] Enqueueing ${unresolvedOperations.length} unresolved matches...`);
    for (const u of unresolvedOperations) {
      await enqueueUnresolvedMatch(u);
    }

    console.log(`[EbaySource] Run complete. Finishing run logs.`);
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    console.error(`[EbaySource] FATAL ERROR:`, error);
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'ebay', message: 'eBay source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}