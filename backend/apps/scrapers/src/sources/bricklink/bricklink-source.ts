import { browserManager } from '../../common/browser-manager';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickLinkSearchHtml } from './bricklink-parser';

export async function runBrickLinkSource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'bricklink' } });
  if (!source || !source.enabled) return;

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { item: { select: { setNumber: true } } }
  });

  const searchQueries = Array.from(
    new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))
  ) as string[];

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('bricklink');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const creates: string[] = [];
    const now = new Date().toISOString();

    for (const query of searchQueries) {
      const url = `https://www.bricklink.com/v2/search.page?q=${encodeURIComponent(query)}#T=S`;
      const html = await browserManager.fetchHtml(url);
      const listings = parseBrickLinkSearchHtml(html);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('bricklink', listing.externalListingId);

        const shippingPrice = listing.shippingPrice ?? estimateUaShippingBySource({
          sourceCode: 'bricklink',
          price: listing.price,
          country: listing.country,
          sealed: listing.sealed,
        });

        const price = listing.price || 0;
        const condition = listing.condition ? `'${listing.condition.replace(/'/g, "''")}'` : 'NULL';
        const sealed = listing.sealed ? 'true' : 'false';
        const titleRawEscaped = listing.titleRaw.replace(/'/g, "''");
        const urlEscaped = listing.url.replace(/'/g, "''");
        const imgEscaped = listing.imageUrl ? `'${listing.imageUrl.replace(/'/g, "''")}'` : 'NULL';
        const externalIdEscaped = listing.externalListingId.replace(/'/g, "''");
        const currency = listing.currency ? `'${listing.currency.replace(/'/g, "''")}'` : "'USD'";
        const shipCurrency = listing.shippingCurrency ? `'${listing.shippingCurrency.replace(/'/g, "''")}'` : "'USD'";

        creates.push(`('${listingId}', '${source.id}', 'bricklink', '${itemId}', '${externalIdEscaped}', '${titleRawEscaped}', '${urlEscaped}', ${imgEscaped}, ${price}, ${currency}, ${shippingPrice}, ${shipCurrency}, ${condition}, ${sealed}, 'active', '${now}', '${now}')`);

        if (resolvedItemId == null) {
          unresolvedOperations.push({
            listingId,
            sourceCode: 'bricklink',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }
      }
    }

    if (creates.length > 0) {
      const dbChunkSize = 500;
      for (let i = 0; i < creates.length; i += dbChunkSize) {
        const chunk = creates.slice(i, i + dbChunkSize);
        await prisma.$executeRawUnsafe(`
          INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "condition", "sealed", "status", "fetchedAt", "updatedAt")
          VALUES ${chunk.join(',')}
          ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
            "price" = EXCLUDED."price",
            "shippingPrice" = EXCLUDED."shippingPrice",
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
    await logSourceError({ scope: 'scraper', sourceCode: 'bricklink', message: 'BrickLink source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}