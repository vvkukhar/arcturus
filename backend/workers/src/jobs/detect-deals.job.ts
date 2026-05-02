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
    where: {
      status: 'active',
    },
    orderBy: {
      fetchedAt: 'desc',
    },
    take: 1000,
  });

  let createdOrUpdated = 0;

  for (const listing of listings) {
    const watchlistItems = await prisma.watchlistItem.findMany({
      where: {
        itemId: listing.itemId,
        active: true,
      },
    });

    for (const watchlistItem of watchlistItems) {
      const buyPrice = toMoney(
        Number(listing.price) + Number(listing.shippingPrice ?? 0),
      );

      const targetSellPrice = toMoney(
        watchlistItem.targetSellPrice ?? watchlistItem.maxBuyPrice * 1.4,
      );

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

      if (action === 'SKIP') {
        continue;
      }

      const existing = await prisma.deal.findFirst({
        where: {
          listingId: listing.id,
          watchlistItemId: watchlistItem.id,
        },
      });

      if (existing) {
        await prisma.deal.update({
          where: {
            id: existing.id,
          },
          data: {
            buyPrice,
            targetSellPrice,
            profit,
            roiPercent,
            action,
            score,
            status: 'open',
          },
        });
      } else {
        await prisma.deal.create({
          data: {
            listingId: listing.id,
            watchlistItemId: watchlistItem.id,
            buyPrice,
            targetSellPrice,
            profit,
            roiPercent,
            action,
            score,
            status: 'open',
          },
        });
      }

      createdOrUpdated += 1;
    }
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