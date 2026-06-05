import { httpClient } from '../../common/http-client';
import { resolveItemIdFromTitle } from '../../common/item-matcher';
import { stableListingId } from '../../common/listing-id';
import { logSourceError } from '../../common/source-error-logger';
import { finishSourceRun, startSourceRun } from '../../common/source-run-logger';
import { getOrCreatePlaceholderItemId } from '../../common/placeholder-item';
import { prisma } from '../../prisma';
import { parseBrickeconomySearchHtml } from './brickeconomy-parser';

export async function runBrickEconomySource(specificQuery?: string | null): Promise<void> {
  const source = await prisma.marketSource.findUnique({ where: { code: 'brickeconomy' } });
  if (!source || !source.enabled) return;

  let searchQueries: string[] = [];

  if (specificQuery && specificQuery.trim()) {
    searchQueries = [specificQuery.trim()];
  } else {
    const activeWatchlist = await prisma.watchlistItem.findMany({
      where: { active: true },
      select: { item: { select: { setNumber: true } } }
    });
    searchQueries = Array.from(new Set(activeWatchlist.map(w => w.item?.setNumber).filter(Boolean))) as string[];
  }

  if (searchQueries.length === 0) return;

  const runId = await startSourceRun('brickeconomy');

  let itemsSeen = 0;
  let itemsMatched = 0;
  let itemsInserted = 0;
  let itemsUpdated = 0;

  try {
    const creates: string[] = [];
    const now = new Date().toISOString();

    for (const query of searchQueries) {
      const url = `https://www.brickeconomy.com/search?query=${encodeURIComponent(query)}`;
      const response = await httpClient.get<string>(url);
      const marketData = parseBrickeconomySearchHtml(response.data);

      for (const data of marketData) {
        itemsSeen += 1;

        const resolvedItemId = await resolveItemIdFromTitle(data.titleRaw);
        const itemId = resolvedItemId ?? (await getOrCreatePlaceholderItemId());
        const listingId = stableListingId('brickeconomy', data.externalListingId);

        const price = data.price || 0;
        const titleRawEscaped = data.titleRaw.replace(/'/g, "''");
        const urlEscaped = data.url.replace(/'/g, "''");
        const externalIdEscaped = data.externalListingId.replace(/'/g, "''");
        const currency = data.currency ? `'${data.currency.replace(/'/g, "''")}'` : "'USD'";

        creates.push(`('${listingId}', '${source.id}', 'brickeconomy', '${itemId}', '${externalIdEscaped}', '${titleRawEscaped}', '${urlEscaped}', NULL, ${price}, ${currency}, 0, ${currency}, 'newSealed', true, 'active', '${now}', '${now}')`);

        if (resolvedItemId != null) {
          itemsMatched += 1;
        }
      }
      await new Promise((res) => setTimeout(res, 3000 + Math.random() * 3000));
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
            "status" = 'active',
            "fetchedAt" = EXCLUDED."fetchedAt",
            "updatedAt" = EXCLUDED."updatedAt"
        `);
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