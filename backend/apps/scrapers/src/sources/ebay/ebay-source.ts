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

export async function runEbaySource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'ebay' } });
  if (!source || !source.enabled) return;

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { item: { select: { setNumber: true } } }
  });

  const searchQueries = Array.from(
    new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))
  ) as string[];

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('ebay');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const upsertOperations: any[] = [];
    const unresolvedOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      const url = `https://www.ebay.com/sch/i.html?_nkw=lego+${encodeURIComponent(query)}&_sacat=0`;
      const html = await browserManager.fetchHtml(url);
      const listings = parseEbaySearchHtml(html);

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

    if (upsertOperations.length > 0) {
      const chunkSize = 100;
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
    await logSourceError({ scope: 'scraper', sourceCode: 'ebay', message: 'eBay source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}