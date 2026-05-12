import { prisma } from '../prisma';

export async function recomputeMarketSnapshotsJob(): Promise<{ totalItems: number; snapshotsCreated: number }> {
  const chunkSize = 500;
  let snapshotsCreated = 0;
  let totalItems = 0;

  let hasMore = true;
  let lastId: string | undefined = undefined;

  while (hasMore) {
    const chunk = await prisma.item.findMany({
      select: { id: true },
      take: chunkSize,
      skip: lastId ? 1 : undefined,
      cursor: lastId ? { id: lastId } : undefined,
      orderBy: { id: 'asc' },
    });

    if (chunk.length === 0) {
      hasMore = false;
      break;
    }

    lastId = chunk[chunk.length - 1].id;
    totalItems += chunk.length;

    const itemIds = chunk.map((c) => c.id);

    const activeListings = await prisma.marketListing.findMany({
      where: { itemId: { in: itemIds }, status: 'active' },
      select: { itemId: true, price: true, shippingPrice: true, sealed: true },
    });

    const listingsByItem = new Map<string, typeof activeListings>();

    for (const listing of activeListings) {
      const arr = listingsByItem.get(listing.itemId) || [];
      arr.push(listing);
      listingsByItem.set(listing.itemId, arr);
    }

    const snapshotData = [];

    for (const item of chunk) {
      const listings = listingsByItem.get(item.id) || [];

      if (listings.length === 0) {
        snapshotData.push({
          itemId: item.id,
          scope: 'ua',
          listingsCount: 0,
          confidenceScore: 0,
          computedAt: new Date(),
        });
        continue;
      }

      let minPrice = Infinity;
      let minPriceWithShipping = Infinity;
      let minShipping = Infinity;
      let maxShipping = -Infinity;
      
      let sumPrice = 0;
      let sumShipping = 0;
      let sumSealed = 0;
      let sumUsed = 0;
      
      let countSealed = 0;
      let countUsed = 0;
      let countShipping = 0;

      const prices: number[] = [];

      for (const listing of listings) {
        const p = Number(listing.price);
        const s = Number(listing.shippingPrice ?? 0);
        const pws = p + s;

        prices.push(p);
        sumPrice += p;

        if (p < minPrice) minPrice = p;
        if (pws < minPriceWithShipping) minPriceWithShipping = pws;

        if (s > 0) {
          sumShipping += s;
          countShipping++;
          if (s < minShipping) minShipping = s;
          if (s > maxShipping) maxShipping = s;
        }

        if (listing.sealed) {
          sumSealed += p;
          countSealed++;
        } else {
          sumUsed += p;
          countUsed++;
        }
      }

      prices.sort((a, b) => a - b);

      const avg = sumPrice / listings.length;
      const mid = Math.floor(prices.length / 2);
      const median = prices.length % 2 === 0 ? (prices[mid - 1] + prices[mid]) / 2 : prices[mid];
      
      const confidenceScore = listings.length >= 10 ? 0.95 : listings.length >= 5 ? 0.8 : listings.length >= 2 ? 0.65 : 0.45;

      snapshotData.push({
        itemId: item.id,
        scope: 'ua',
        listingsCount: listings.length,
        lowestPrice: minPrice === Infinity ? null : minPrice,
        lowestPriceWithShipping: minPriceWithShipping === Infinity ? null : minPriceWithShipping,
        avgPrice: avg,
        medianPrice: median,
        avgShipping: countShipping > 0 ? sumShipping / countShipping : null,
        minShipping: minShipping === Infinity ? null : minShipping,
        maxShipping: maxShipping === -Infinity ? null : maxShipping,
        sealedAvgPrice: countSealed > 0 ? sumSealed / countSealed : null,
        usedAvgPrice: countUsed > 0 ? sumUsed / countUsed : null,
        confidenceScore,
        computedAt: new Date(),
      });
    }

    if (snapshotData.length > 0) {
      await prisma.marketSnapshot.createMany({ data: snapshotData });
      snapshotsCreated += snapshotData.length;
    }
  }

  return { totalItems, snapshotsCreated };
}