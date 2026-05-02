import { calculateProfit, calculateRoiPercent, toMoney } from '../common/math';
import { prisma } from '../prisma';

export async function autoQueueOpportunitiesJob(params?: {
  minRoiPercent?: number;
  minProfit?: number;
  maxItems?: number;
}): Promise<{
  scanned: number;
  queued: number;
}> {
  const minRoiPercent = params?.minRoiPercent ?? 25;
  const minProfit = params?.minProfit ?? 150;
  const maxItems = params?.maxItems ?? 50;

  const watchlist = await prisma.watchlistItem.findMany({
    where: {
      active: true,
    },
    orderBy: {
      priority: 'desc',
    },
    take: maxItems,
  });

  let scanned = 0;
  let queued = 0;

  for (const item of watchlist) {
    scanned += 1;

    const listing = await prisma.marketListing.findFirst({
      where: {
        itemId: item.itemId,
        status: 'active',
      },
      orderBy: {
        price: 'asc',
      },
      include: {
        source: true,
      },
    });

    if (!listing) {
      continue;
    }

    const buyPrice = toMoney(listing.price + (listing.shippingPrice ?? 0));
    const targetSellPrice = toMoney(item.targetSellPrice ?? 0);

    if (buyPrice <= 0 || targetSellPrice <= 0) {
      continue;
    }

    const profit = calculateProfit({
      revenue: targetSellPrice,
      cost: buyPrice,
    });

    const roiPercent = calculateRoiPercent({
      profit,
      cost: buyPrice,
    });

    if (profit < minProfit || roiPercent < minRoiPercent) {
      continue;
    }

    const existing = await prisma.purchaseFlowItem.findFirst({
      where: {
        watchlistItemId: item.id,
        status: {
          in: ['pending', 'queued'],
        },
      },
    });

    if (existing) {
      continue;
    }

await prisma.purchaseFlowItem.create({
  data: {
    watchlistItemId: item.id,
    selectedPrice: buyPrice,
    status: 'queued',
    reason: `Queued from ${listing.source?.code ?? 'market'}`,
  },
});

    queued += 1;
  }

  return {
    scanned,
    queued,
  };
}