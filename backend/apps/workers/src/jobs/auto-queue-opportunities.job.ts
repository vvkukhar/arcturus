import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { prisma } from '../prisma';

export async function autoQueueOpportunitiesJob(params?: {
  minRoiPercent?: number;
  minProfit?: number;
  maxItems?: number;
}): Promise<{ scanned: number; queued: number }> {
  const minRoiPercent = params?.minRoiPercent ?? 25;
  const minProfit = params?.minProfit ?? 150;
  const maxItems = params?.maxItems ?? 50;

  const watchlist = await prisma.watchlistItem.findMany({
    where: { active: true },
    orderBy: { priority: 'desc' },
    take: maxItems,
  });

  if (watchlist.length === 0) return { scanned: 0, queued: 0 };

  const itemIds = watchlist.map((w) => w.itemId);

  const [listings, existingFlows] = await Promise.all([
    prisma.marketListing.findMany({
      where: { itemId: { in: itemIds }, status: 'active' },
      orderBy: { price: 'asc' },
      include: { source: true },
    }),
    prisma.purchaseFlowItem.findMany({
      where: { watchlistItemId: { in: watchlist.map(w => w.id) }, status: { in: ['pending', 'queued'] } },
    }),
  ]);

  const listingsMap = new Map<string, any[]>();
  for (const listing of listings) {
    const arr = listingsMap.get(listing.itemId) || [];
    arr.push(listing);
    listingsMap.set(listing.itemId, arr);
  }

  const existingFlowsSet = new Set(existingFlows.map((f: any) => f.watchlistItemId));
  const dbOperations: any[] = [];

  let scanned = 0;
  let queued = 0;

  for (const item of watchlist) {
    scanned += 1;

    const bestListing = (listingsMap.get(item.itemId) || [])[0];
    if (!bestListing) continue;

    const buyPrice = toMoney(bestListing.price + (bestListing.shippingPrice ?? 0));
    const targetSellPrice = toMoney(item.targetSellPrice ?? 0);

    if (buyPrice <= 0 || targetSellPrice <= 0) continue;

    const profit = calculateProfit({ revenue: targetSellPrice, cost: buyPrice });
    const roiPercent = calculateRoiPercent({ profit, cost: buyPrice });

    if (profit < minProfit || roiPercent < minRoiPercent) continue;
    if (existingFlowsSet.has(item.id)) continue;

    dbOperations.push(
      prisma.purchaseFlowItem.create({
        data: {
          watchlistItemId: item.id,
          selectedPrice: buyPrice,
          status: 'queued',
          reason: `Queued from ${bestListing.source?.code ?? 'market'}`,
        },
      })
    );

    queued += 1;
  }

  if (dbOperations.length > 0) {
    await prisma.$transaction(dbOperations);
  }

  return { scanned, queued };
}