import axios from 'axios';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickLinkSearchHtml } from './bricklink-parser';

const searchQueries = ['70621', '70624', '70659', '71700', '75301', '75367'];

export async function runBrickLinkSource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'bricklink' } });
  if (!source || !source.enabled) return;

  const runId = await startSourceRun('bricklink');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const upsertOperations: any[] = [];
    const unresolvedOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      const url = `https://www.bricklink.com/v2/search.page?q=${encodeURIComponent(query)}#T=S`;

      const response = await axios.get<string>(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000,
      });

      const listings = parseBrickLinkSearchHtml(response.data);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('bricklink', listing.externalListingId);

        const shippingPrice = listing.shippingPrice ?? estimateUaShippingBySource({
          sourceCode: 'bricklink',
          itemPrice: listing.price,
          currency: listing.currency,
          sealed: listing.sealed,
        });

        const shippingCurrency = listing.shippingCurrency ?? listing.currency ?? 'USD';

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
              currency: listing.currency,
              shippingPrice,
              shippingCurrency,
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
              shippingCurrency,
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
            sourceCode: 'bricklink',
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
    await logSourceError({ scope: 'scraper', sourceCode: 'bricklink', message: 'BrickLink source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
    throw error;
  }
}