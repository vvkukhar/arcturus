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
  const listings = await prisma.marketListing.findMany({
    where: { status: 'active' },
    orderBy: { fetchedAt: 'desc' },
    take: 1000,
  });

  if (listings.length === 0) {
    return { scannedListings: 0, createdOrUpdated: 0 };
  }

  const itemIds = [...new Set(listings.map((l) => l.itemId))];

  const watchlistItems = await prisma.watchlistItem.findMany({
    where: { itemId: { in: itemIds }, active: true },
  });

  if (watchlistItems.length === 0) {
    return { scannedListings: listings.length, createdOrUpdated: 0 };
  }

  const watchlistMap = new Map<string, typeof watchlistItems>();
  for (const w of watchlistItems) {
    const arr = watchlistMap.get(w.itemId) || [];
    arr.push(w);
    watchlistMap.set(w.itemId, arr);
  }

  const existingDeals = await prisma.deal.findMany({
    where: { listingId: { in: listings.map((l) => l.id) } },
  });

  const existingDealsMap = new Map(
    existingDeals.map((d) => [`${d.listingId}_${d.watchlistItemId}`, d]),
  );

  const dbOperations: any[] = [];
  let createdOrUpdated = 0;

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
      const existing = existingDealsMap.get(dealKey);

      const dealData = {
        buyPrice,
        targetSellPrice,
        profit,
        roiPercent,
        action,
        score,
        status: 'open',
      };

      if (existing) {
        dbOperations.push(
          prisma.deal.update({
            where: { id: existing.id },
            data: dealData,
          })
        );
      } else {
        dbOperations.push(
          prisma.deal.create({
            data: {
              listingId: listing.id,
              watchlistItemId: watchlistItem.id,
              ...dealData,
            },
          })
        );
      }
      createdOrUpdated += 1;
    }
  }

  if (dbOperations.length > 0) {
    await prisma.$transaction(dbOperations);
  }

  await prisma.activityLog.create({
    data: {
      action: 'worker.deals.detected',
      payloadJson: {
        scannedListings: listings.length,
        createdOrUpdated,
      },
    },
  });

  return {
    scannedListings: listings.length,
    createdOrUpdated,
  };
}