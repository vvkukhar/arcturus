import { prisma } from '../prisma';

function toMoney(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

function roi(profit: number, cost: number): number {
  return cost <= 0 ? 0 : toMoney((profit / cost) * 100);
}

export async function detectDealsJob(): Promise<{ scannedListings: number; createdOrUpdated: number }> {
  const chunkSize = 2000;
  let scannedListings = 0;
  let createdOrUpdated = 0;

  let hasMore = true;
  let lastId: string | undefined = undefined;

  while (hasMore) {
    const listingsQuery = await prisma.marketListing.findMany({
      where: { status: 'active' },
      orderBy: { id: 'asc' },
      take: chunkSize,
      skip: lastId ? 1 : undefined,
      cursor: lastId ? { id: lastId } : undefined,
      select: { id: true, itemId: true, price: true, shippingPrice: true }
    });

    const listings: Array<{ id: string; itemId: string; price: number; shippingPrice: number | null }> = listingsQuery;

    if (listings.length === 0) {
      hasMore = false;
      break;
    }

    lastId = listings[listings.length - 1].id;
    scannedListings += listings.length;

    const itemIds = Array.from(new Set<string>(listings.map((l) => String(l.itemId))));
    
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { itemId: { in: itemIds }, active: true },
      select: { id: true, itemId: true, maxBuyPrice: true, desiredBuyPrice: true, targetSellPrice: true }
    });

    if (watchlistItems.length === 0) continue;

    const watchlistMap = new Map<string, typeof watchlistItems>();
    for (const w of watchlistItems) {
      const arr = watchlistMap.get(w.itemId) || [];
      arr.push(w);
      watchlistMap.set(w.itemId, arr);
    }

    const creates: string[] = [];
    const now = new Date().toISOString();

    for (const listing of listings) {
      const matchedWatchlists = watchlistMap.get(listing.itemId);
      if (!matchedWatchlists) continue;

      for (const watchlistItem of matchedWatchlists) {
        const buyPrice = toMoney(listing.price + (listing.shippingPrice ?? 0));
        const targetSellPrice = toMoney(watchlistItem.targetSellPrice ?? watchlistItem.maxBuyPrice * 1.4);
        const profit = toMoney(targetSellPrice - buyPrice);
        const roiPercent = roi(profit, buyPrice);

        let action = 'SKIP';
        let score = 35;

        if (buyPrice <= watchlistItem.desiredBuyPrice && roiPercent >= 30) {
          action = 'BUY_NOW';
          score = 92;
        } else if (buyPrice <= watchlistItem.maxBuyPrice && roiPercent >= 20) {
          action = 'BUY';
          score = 78;
        } else if (buyPrice <= watchlistItem.maxBuyPrice) {
          action = 'WATCH';
          score = 60;
        }

        if (action === 'SKIP') continue;

        const id = `${listing.id}_${watchlistItem.id}`;
        
        creates.push(`('${id}', '${listing.id}', '${watchlistItem.id}', ${buyPrice}, ${targetSellPrice}, ${profit}, ${roiPercent}, '${action}', ${score}, 'open', '${now}')`);
        
        createdOrUpdated += 1;
      }
    }

    if (creates.length > 0) {
      const dbChunkSize = 500; 
      for (let i = 0; i < creates.length; i += dbChunkSize) {
        const chunk = creates.slice(i, i + dbChunkSize);
        await prisma.$executeRawUnsafe(`
          INSERT INTO "Deal" ("id", "listingId", "watchlistItemId", "buyPrice", "targetSellPrice", "profit", "roiPercent", "action", "score", "status", "updatedAt")
          VALUES ${chunk.join(',')}
          ON CONFLICT ("watchlistItemId", "listingId") DO UPDATE SET
            "buyPrice" = EXCLUDED."buyPrice",
            "targetSellPrice" = EXCLUDED."targetSellPrice",
            "profit" = EXCLUDED."profit",
            "roiPercent" = EXCLUDED."roiPercent",
            "action" = EXCLUDED."action",
            "score" = EXCLUDED."score",
            "updatedAt" = EXCLUDED."updatedAt"
        `);
      }
    }
  }

  await prisma.activityLog.create({
    data: {
      action: 'worker.deals.detected',
      payloadJson: { scannedListings, createdOrUpdated },
    },
  });

  return { scannedListings, createdOrUpdated };
}