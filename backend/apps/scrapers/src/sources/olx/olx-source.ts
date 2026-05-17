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
    const creates: any[] = [];
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
        
        creates.push({
          id: listingId,
          sourceId: source.id,
          sourceCode: 'olx',
          itemId,
          externalListingId: listing.externalListingId,
          titleRaw: listing.titleRaw,
          url: listing.url,
          imageUrl: listing.imageUrl ?? null,
          price: listing.price || 0,
          currency: 'UAH',
          shippingPrice: listing.shippingPrice || 0,
          shippingCurrency: 'UAH',
          status: 'active',
          fetchedAt: now,
          updatedAt: now,
        });

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

      // ФІКС: Скидаємо масив прямо в циклі, щоб не накопичувати RAM
      if (creates.length >= 500) {
        await prisma.$executeRaw`
          INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "status", "fetchedAt", "updatedAt")
          SELECT * FROM jsonb_to_recordset(${JSON.stringify(creates)}::jsonb) AS x(
            "id" text, "sourceId" text, "sourceCode" text, "itemId" text, "externalListingId" text, 
            "titleRaw" text, "url" text, "imageUrl" text, "price" float, "currency" text, 
            "shippingPrice" float, "shippingCurrency" text, "status" text, "fetchedAt" timestamp, "updatedAt" timestamp
          )
          ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
            "price" = EXCLUDED."price",
            "status" = 'active',
            "fetchedAt" = EXCLUDED."fetchedAt",
            "updatedAt" = EXCLUDED."updatedAt"
        `;
        itemsInserted += creates.length;
        creates.length = 0; // Очищуємо пам'ять!
      }
    }

    // Дозаписуємо залишки
    if (creates.length > 0) {
      await prisma.$executeRaw`
        INSERT INTO "MarketListing" ("id", "sourceId", "sourceCode", "itemId", "externalListingId", "titleRaw", "url", "imageUrl", "price", "currency", "shippingPrice", "shippingCurrency", "status", "fetchedAt", "updatedAt")
        SELECT * FROM jsonb_to_recordset(${JSON.stringify(creates)}::jsonb) AS x(
          "id" text, "sourceId" text, "sourceCode" text, "itemId" text, "externalListingId" text, 
          "titleRaw" text, "url" text, "imageUrl" text, "price" float, "currency" text, 
          "shippingPrice" float, "shippingCurrency" text, "status" text, "fetchedAt" timestamp, "updatedAt" timestamp
        )
        ON CONFLICT ("sourceCode", "externalListingId") DO UPDATE SET
          "price" = EXCLUDED."price",
          "status" = 'active',
          "fetchedAt" = EXCLUDED."fetchedAt",
          "updatedAt" = EXCLUDED."updatedAt"
      `;
      itemsInserted += creates.length;
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