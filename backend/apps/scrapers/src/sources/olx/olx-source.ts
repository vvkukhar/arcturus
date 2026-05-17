import { browserManager } from '../../common/browser-manager';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseOlxSearchHtml } from './olx-parser';

export async function runOlxSource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'olx' } });
  if (!source || !source.enabled) return;

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { item: { select: { setNumber: true } } }
  });

  const searchQueries = Array.from(
    new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))
  ) as string[];

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('olx');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const creates: string[] = [];
    const now = new Date().toISOString();

    for (const query of searchQueries) {
      const url = `https://www.olx.ua/uk/list/q-lego-${encodeURIComponent(query)}/`;
      const html = await browserManager.fetchHtml(url);
      const listings = parseOlxSearchHtml(html);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('olx', listing.externalListingId);
        
        const price = listing.price || 0;
        const shippingPrice = listing.shippingPrice || 0;
        const titleRawEscaped = listing.titleRaw.replace(/'/g, "''");
        const urlEscaped = listing.url.replace(/'/g, "''");
        const imgEscaped = listing.imageUrl ? `'${listing.imageUrl.replace(/'/g, "''")}'` : 'NULL';

        // ФІКС: Будуємо RAW SQL для надшвидкого Bulk Upsert
        creates.push(`('${listingId}', '${source.id}', 'olx', '${itemId}', '${listing.externalListingId}', '${titleRawEscaped}', '${urlEscaped}', ${imgEscaped}, ${price}, 'UAH', ${shippingPrice}, 'UAH', 'active', '${now}', '${now}')`);

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

    // Виконуємо надшвидкий масовий інсерт пачками по 500
    if (creates.length > 0) {
      const dbChunkSize = 500; 
      for (let i = 0; i < creates.length; i += dbChunkSize) {
        const chunk = creates.slice(i, i + dbChunkSize);
        await prisma.$executeRawUnsafe(`
          INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "status", "fetchedAt", "updatedAt")
          VALUES ${chunk.join(',')}
          ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
            "price" = EXCLUDED."price",
            "status" = 'active',
            "fetchedAt" = EXCLUDED."fetchedAt",
            "updatedAt" = EXCLUDED."updatedAt"
        `);
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