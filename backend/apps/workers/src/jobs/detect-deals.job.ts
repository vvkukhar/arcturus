import { prisma } from '../prisma';

function toMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

function roi(profit: number, cost: number): number {
  if (cost <= 0) return 0;
  return toMoney((profit / cost) * 100);
}

export async function detectDealsJob(): Promise<{
  scannedListings: number;
  createdOrUpdated: number;
}> {
  const chunkSize = 500;
  let scannedListings = 0;
  let createdOrUpdated = 0;

  let hasMore = true;
  let lastId: string | undefined = undefined;

  while (hasMore) {
    const listings = (await prisma.marketListing.findMany({
      where: { status: 'active' },
      orderBy: { id: 'asc' },
      take: chunkSize,
      skip: lastId ? 1 : undefined,
      cursor: lastId ? { id: lastId } : undefined,
    })) as { id: string; itemId: string; price: number; shippingPrice: number | null }[];

    if (listings.length === 0) {
      hasMore = false;
      break;
    }

    lastId = listings[listings.length - 1].id;
    scannedListings += listings.length;

    const itemIds = Array.from(new Set(listings.map((l) => String(l.itemId))));
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: { itemId: { in: itemIds }, active: true },
    });

    if (watchlistItems.length === 0) continue;

    const watchlistMap = new Map<string, typeof watchlistItems>();
    for (const w of watchlistItems) {
      const arr = watchlistMap.get(w.itemId) || [];
      arr.push(w);
      watchlistMap.set(w.itemId, arr);
    }

    const existingDeals = await prisma.deal.findMany({
      where: { listingId: { in: listings.map((l) => l.id) } },
      select: { id: true, listingId: true, watchlistItemId: true }
    });

    const existingDealsMap = new Map(existingDeals.map((d) => [`${d.listingId}_${d.watchlistItemId}`, d.id]));
    const dbOperations: any[] = [];

    for (const listing of listings) {
      const matchedWatchlists = watchlistMap.get(listing.itemId) || [];

      for (const watchlistItem of matchedWatchlists) {
        const buyPrice = toMoney(Number(listing.price) + Number(listing.shippingPrice ?? 0));
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

        const dealKey = `${listing.id}_${watchlistItem.id}`;
        const existingId = existingDealsMap.get(dealKey);

        const dealData = { buyPrice, targetSellPrice, profit, roiPercent, action, score, status: 'open' };

        if (existingId) {
          dbOperations.push(prisma.deal.update({ where: { id: existingId }, data: dealData }));
        } else {
          dbOperations.push(prisma.deal.create({ data: { listingId: listing.id, watchlistItemId: watchlistItem.id, ...dealData } }));
        }
        createdOrUpdated += 1;
      }
    }

    if (dbOperations.length > 0) {
      const dbChunkSize = 100;
      for (let i = 0; i < dbOperations.length; i += dbChunkSize) {
        const chunk = dbOperations.slice(i, i + dbChunkSize);
        await prisma.$transaction(chunk);
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