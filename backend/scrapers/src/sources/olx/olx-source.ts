import axios from 'axios';
import { estimateUaShippingBySource } from '../../common/shipping-estimator';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseOlxSearchHtml } from './olx-parser';

const searchQueries = [
  'lego ninjago',
  'lego star wars',
  'lego minifigures',
  'lego harry potter',
  'lego marvel',
];

export async function runOlxSource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({
    where: { code: 'olx' },
  });

  if (!source || !source.enabled) {
    return;
  }

  const runId = await startSourceRun('olx');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    for (const query of searchQueries) {
      const url = `https://www.olx.ua/uk/list/q-${encodeURIComponent(query)}/`;

      const response = await axios.get<string>(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
        timeout: 15000,
      });

      const listings = parseOlxSearchHtml(response.data);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('olx', listing.externalListingId);
        const now = new Date();

        const existing = await prisma.marketListing.findUnique({
          where: { id: listingId },
        });

        const shippingPrice =
          listing.shippingPrice ??
          estimateUaShippingBySource({
            sourceCode: 'olx',
            itemPrice: listing.price,
            currency: listing.currency,
            sealed: listing.sealed,
          });

        const shippingCurrency = listing.shippingCurrency ?? listing.currency ?? 'UAH';

        const upserted = await prisma.marketListing.upsert({
          where: { id: listingId },
          update: {
            sourceCode: source.code,
            itemId,
            externalListingId: listing.externalListingId,
            externalId: listing.externalListingId,
            titleRaw: listing.titleRaw,
            title: listing.titleRaw,
            url: listing.url,
            imageUrl: listing.imageUrl,
            sellerName: listing.sellerName,
            sellerRating: listing.sellerRating,
            price: listing.price,
            currency: listing.currency,
            shippingPrice,
            shippingCurrency,
            country: listing.country,
            condition: listing.condition,
            sealed: listing.sealed,
            completenessPercent: listing.completenessPercent,
            quantityAvailable: listing.quantityAvailable,
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
            sellerName: listing.sellerName,
            sellerRating: listing.sellerRating,
            price: listing.price,
            currency: listing.currency,
            shippingPrice,
            shippingCurrency,
            country: listing.country,
            condition: listing.condition,
            sealed: listing.sealed,
            completenessPercent: listing.completenessPercent,
            quantityAvailable: listing.quantityAvailable,
            status: 'active',
            fetchedAt: now,
            firstSeenAt: now,
            lastSeenAt: now,
          },
        });

        if (resolvedItemId == null) {
          await enqueueUnresolvedMatch({
            listingId: upserted.id,
            sourceCode: 'olx',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }

        if (existing == null) {
          itemsInserted += 1;
        } else {
          itemsUpdated += 1;
        }
      }
    }

    await finishSourceRun({
      runId,
      itemsSeen,
      itemsMatched,
      itemsInserted,
      itemsUpdated,
      status: 'success',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await logSourceError({
      scope: 'scraper',
      sourceCode: 'olx',
      message: 'OLX source failed',
      detailsJson: { error: message },
    });

    await finishSourceRun({
      runId,
      itemsSeen,
      itemsMatched,
      itemsInserted,
      itemsUpdated,
      status: 'failed',
      errorMessage: message,
    });

    throw error;
  }
}