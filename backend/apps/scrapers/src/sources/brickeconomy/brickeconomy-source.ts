import { httpClient } from '../../common/http-client';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickEconomySearchHtml } from './brickeconomy-parser';

export async function runBrickEconomySource(): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'brickeconomy' } });
  if (!source || !source.enabled) return;

  const activeWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    select: { item: { select: { setNumber: true } } }
  });

  const searchQueries = Array.from(
    new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))
  ) as string[];

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('brickeconomy');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const upsertOperations: any[] = [];
    const now = new Date();

    for (const query of searchQueries) {
      const url = `https://www.brickeconomy.com/search?query=${encodeURIComponent(query)}`;
      const response = await httpClient.get<string>(url);
      const marketData = parseBrickEconomySearchHtml(response.data);

      for (const data of marketData) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(data.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('brickeconomy', data.externalListingId);

        upsertOperations.push(
          prisma.marketListing.upsert({
            where: { id: listingId },
            update: {
              sourceCode: source.code,
              itemId,
              titleRaw: data.titleRaw,
              title: data.titleRaw,
              url: data.url,
              price: data.price,
              currency: data.currency ?? 'USD',
              condition: 'newSealed',
              sealed: true,
              status: 'active',
              fetchedAt: now,
              lastSeenAt: now,
            },
            create: {
              id: listingId,
              sourceId: source.id,
              sourceCode: source.code,
              itemId,
              externalListingId: data.externalListingId,
              externalId: data.externalListingId,
              titleRaw: data.titleRaw,
              title: data.titleRaw,
              url: data.url,
              price: data.price,
              currency: data.currency ?? 'USD',
              condition: 'newSealed',
              sealed: true,
              status: 'active',
              fetchedAt: now,
              firstSeenAt: now,
              lastSeenAt: now,
            },
          })
        );

        if (resolvedItemId != null) {
          itemsMatched += 1;
        }
      }
      await new Promise((res) => setTimeout(res, 3000 + Math.random() * 3000));
    }

    if (upsertOperations.length > 0) {
      const chunkSize = 100;
      for (let i = 0; i < upsertOperations.length; i += chunkSize) {
        const chunk = upsertOperations.slice(i, i + chunkSize);
        await prisma.$transaction(chunk);
        itemsInserted += chunk.length;
      }
    }

    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'success' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logSourceError({ scope: 'scraper', sourceCode: 'brickeconomy', message: 'BrickEconomy source failed', detailsJson: { error: message } });
    await finishSourceRun({ runId, itemsSeen, itemsMatched, itemsInserted, itemsUpdated, status: 'failed', errorMessage: message });
  }
}