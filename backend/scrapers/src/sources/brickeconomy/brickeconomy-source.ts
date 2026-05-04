import axios from 'axios';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { enqueueUnresolvedMatch } from '../../common/unresolved-match-handler';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickeconomySearchHtml } from './brickeconomy-parser';

const searchQueries = ['70621', '75301', '71700'];

export async function runBrickeconomySource(): Promise<void> {
  let source = await prisma.marketSource.findUnique({ where: { code: 'brickeconomy' } });

  if (!source) {
    source = await prisma.marketSource.create({
      data: { code: 'brickeconomy', name: 'BrickEconomy', type: 'analytics', enabled: true },
    });
  }

  if (!source.enabled) return;

  const runId = await startSourceRun('brickeconomy');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    for (const query of searchQueries) {
      const url = `https://www.brickeconomy.com/search?query=${encodeURIComponent(query)}`;

      const response = await axios.get<string>(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
          Accept: 'text/html',
        },
        timeout: 15000,
      });

      const listings = parseBrickeconomySearchHtml(response.data);

      for (const listing of listings) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(listing.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('brickeconomy', listing.externalListingId);
        const now = new Date();

        const existing = await prisma.marketListing.findUnique({ where: { id: listingId } });

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
            price: listing.price,
            currency: listing.currency,
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
            price: listing.price,
            currency: listing.currency,
            status: 'active',
            fetchedAt: now,
            firstSeenAt: now,
            lastSeenAt: now,
          },
        });

        if (resolvedItemId == null) {
          await enqueueUnresolvedMatch({
            listingId: upserted.id,
            sourceCode: 'brickeconomy',
            titleRaw: listing.titleRaw,
          });
        } else {
          itemsMatched += 1;
        }

        if (existing == null) itemsInserted += 1;
        else itemsUpdated += 1;
      }
    }

    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'brickeconomy', message: 'Brickeconomy source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}