import { browserManager } from '../../common/browser-manager';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseOlxSearchHtml } from './olx-parser';

export async function runOlxSource(specificQuery?: string | null): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'olx' } });
  if (!source || !source.enabled) return;

  let searchQueries: string[] = [];

  // Якщо ти ввів артикул в адмінці — парсимо ТІЛЬКИ його
  if (specificQuery && specificQuery.trim()) {
    searchQueries = [specificQuery.trim()];
  } else {
    // Інакше парсимо весь Watchlist
    const activeWatchlist = await prisma.watchlistItem.findMany({
      where: { active: true },
      select: { item: { select: { setNumber: true } } }
    });
    searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))) as string[];
  }

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('olx');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const upsertOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      const url = `https://www.olx.ua/uk/list/q-lego-${encodeURIComponent(query)}/`;
      const html = await browserManager.fetchHtml(url);
      const listings = parseOlxSearchHtml(html);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('olx', listing.externalListingId);
        
        // 🔥 ВИКОРИСТОВУЄМО НАДІЙНИЙ PRISMA UPSERT ЗАМІСТЬ СИРОГО SQL
        upsertOperations.push(
          prisma.marketListing.upsert({
            where: { id: listingId },
            update: {
              price: listing.price || 0,
              shippingPrice: listing.shippingPrice || 0,
              status: 'active',
              fetchedAt: now,
              updatedAt: now,
            },
            create: {
              id: listingId,
              sourceId: source.id,
              sourceCode: 'olx',
              itemId,
              externalListingId: listing.externalListingId,
              externalId: listing.externalListingId,
              titleRaw: listing.titleRaw,
              title: listing.titleRaw,
              url: listing.url,
              imageUrl: listing.imageUrl ?? null,
              price: listing.price || 0,
              currency: 'UAH',
              shippingPrice: listing.shippingPrice || 0,
              shippingCurrency: 'UAH',
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
            sourceCode: 'olx',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }
      }
    }

    // Безпечне збереження батчами
    if (upsertOperations.length > 0) {
      const chunkSize = 50;
      for (let i = 0; i < upsertOperations.length; i += chunkSize) {
        const chunk = upsertOperations.slice(i, i + chunkSize);
        await prisma.$transaction(chunk);
        itemsInserted += chunk.length;
      }
    }

    for (const u of unresolvedOperations) {
      await enqueueUnresolvedMatch(u);
    }

    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'olx', message: 'OLX source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}