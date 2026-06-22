// C:\Users\Vlad\lego_trading_manager\backend\apps\scrapers\src\sources\brickeconomy\brickeconomy-source.ts

import { browserManager } from '../../common/browser-manager';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickeconomySearchHtml } from './brickeconomy-parser';

export async function runBrickEconomySource(specificQuery?: string | null): Promise<void> {
  console.log('[BrickEconomySource] Starting runBrickEconomySource');
  const source = await prisma.marketSource.findUnique({ where: { code: 'brickeconomy' } });
  
  if (!source || !source.enabled) {
    console.error('[BrickEconomySource] Source not found or disabled');
    return;
  }

  let searchQueries: string[] = [];

  if (specificQuery && specificQuery.trim()) {
    searchQueries = [specificQuery.trim()];
    console.log(`[BrickEconomySource] Using specific query: ${specificQuery}`);
  } else {
    const activeWatchlist = await prisma.watchlistItem.findMany({
      where: { active: true },
      select: { item: { select: { setNumber: true } } }
    });
    searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))) as string[];
    console.log(`[BrickEconomySource] Found ${searchQueries.length} unique set numbers in watchlist`);
  }

  if (searchQueries.length === 0) {
    console.error('[BrickEconomySource] Search queries array is empty');
    return;
  }

  const runId = await startSourceRun('brickeconomy');
  console.log(`[BrickEconomySource] Created Run ID: ${runId}`);

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const upsertOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      console.log(`[BrickEconomySource] Processing query: ${query}`);
      const url = `https://www.brickeconomy.com/search?query=${encodeURIComponent(query)}`;
      
      const html = await browserManager.fetchHtml(url, '.searchlist-item, .row.ItemRow');
      const marketData = parseBrickeconomySearchHtml(html);
      console.log(`[BrickEconomySource] Fetched ${marketData.length} listings for query ${query}`);

      for (const data of marketData) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(data.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('brickeconomy', data.externalListingId);

        upsertOperations.push(
          prisma.marketListing.upsert({
            where: { id: listingId },
            update: {
              price: data.price || 0,
              status: 'active',
              fetchedAt: now,
              updatedAt: now,
            },
            create: {
              id: listingId,
              sourceId: source.id,
              sourceCode: 'brickeconomy',
              itemId,
              externalListingId: data.externalListingId,
              externalId: data.externalListingId,
              titleRaw: data.titleRaw,
              title: data.titleRaw,
              url: data.url,
              imageUrl: data.imageUrl ?? null,
              price: data.price || 0,
              currency: data.currency || 'USD',
              shippingPrice: 0,
              shippingCurrency: data.currency || 'USD',
              condition: 'newSealed',
              sealed: true,
              status: 'active',
              fetchedAt: now,
              firstSeenAt: now,
              lastSeenAt: now,
            }
          })
        );

        if (resolvedItemId != null) itemsMatched += 1;
      }
    }

    console.log(`[BrickEconomySource] Executing ${upsertOperations.length} DB upsert operations...`);
    if (upsertOperations.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < upsertOperations.length; i += chunkSize) {
        const chunk = upsertOperations.slice(i, i + chunkSize);
        await prisma.$transaction(chunk);
        itemsInserted += chunk.length;
      }
    }
    console.log(`[BrickEconomySource] DB upserts complete.`);

    console.log(`[BrickEconomySource] Run complete. Finishing run logs.`);
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    console.error(`[BrickEconomySource] FATAL ERROR:`, error);
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'brickeconomy', message: 'BrickEconomy source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}