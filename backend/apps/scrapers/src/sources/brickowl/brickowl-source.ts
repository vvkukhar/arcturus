import { httpClient } from '../../common/http-client';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickowlSearchHtml } from './brickowl-parser';

export async function runBrickOwlSource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'brickowl' } });
  if (!source || !source.enabled) return;

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { item: { select: { setNumber: true } } }
  });

  const searchQueries = Array.from(
    new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))
  ) as string[];

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('brickowl');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const unresolvedOperations: any[] = [];
    const creates: string[] = [];
    const now = new Date().toISOString();

    for (const query of searchQueries) {
      const url = `https://www.brickowl.com/search/catalog?query=${encodeURIComponent(query)}`;
      const response = await httpClient.get<string>(url);
      const listings = parseBrickowlSearchHtml(response.data);

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

        const price = listing.price || 0;
        const condition = listing.condition ? `'${listing.condition.replace(/'/g, "''")}'` : 'NULL';
        const sealed = listing.sealed ? 'true' : 'false';
        const titleRawEscaped = listing.titleRaw.replace(/'/g, "''");
        const urlEscaped = listing.url.replace(/'/g, "''");
        const imgEscaped = listing.imageUrl ? `'${listing.imageUrl.replace(/'/g, "''")}'` : 'NULL';
        const externalIdEscaped = listing.externalListingId.replace(/'/g, "''");
        const currency = listing.currency ? `'${listing.currency.replace(/'/g, "''")}'` : "'USD'";
        const shipCurrency = listing.shippingCurrency ? `'${listing.shippingCurrency.replace(/'/g, "''")}'` : "'USD'";

        creates.push(`('${listingId}', '${source.id}', 'brickowl', '${itemId}', '${externalIdEscaped}', '${titleRawEscaped}', '${urlEscaped}', ${imgEscaped}, ${price}, ${currency}, ${shippingPrice}, ${shipCurrency}, ${condition}, ${sealed}, 'active', '${now}', '${now}')`);

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
      await new Promise((res) => setTimeout(res, 2500 + Math.random() * 3500));
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
    await logSourceError({ scope: 'scraper', sourceCode: 'brickowl', message: 'BrickOwl source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}