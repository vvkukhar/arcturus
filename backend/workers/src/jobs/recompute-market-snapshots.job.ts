import { convertToUah } from '../common/currency-converter';
import { avg, median } from '../common/money';
import { prisma } from '../prisma';

export async function recomputeMarketSnapshotsJob(): Promise<{
  totalItems: number;
  snapshotsCreated: number;
}> {
  const items = await prisma.item.findMany({
    select: { id: true },
  });

  const activeListings = await prisma.marketListing.findMany({
    where: { status: 'active' },
    select: {
      itemId: true,
      price: true,
      currency: true,
      shippingPrice: true,
      shippingCurrency: true,
      sealed: true,
    },
  });

  const listingsByItem = new Map<string, typeof activeListings>();

  for (const listing of activeListings) {
    const arr = listingsByItem.get(listing.itemId) || [];
    arr.push(listing);
    listingsByItem.set(listing.itemId, arr);
  }

  const snapshotData = items.map((item) => {
    const listings = listingsByItem.get(item.id) || [];

    if (listings.length === 0) {
      return {
        itemId: item.id,
        scope: 'ua',
        listingsCount: 0,
        confidenceScore: 0,
      };
    }

    const prices: number[] = [];
    const pricesWithShipping: number[] = [];
    const shipping: number[] = [];
    const sealedPrices: number[] = [];
    const usedPrices: number[] = [];

    for (const listing of listings) {
      const price = convertToUah(listing.price, listing.currency);
      const ship = convertToUah(
        listing.shippingPrice ?? 0,
        listing.shippingCurrency ?? listing.currency,
      );

      if (Number.isFinite(price) && price > 0) {
        prices.push(price);
        pricesWithShipping.push(price + ship);

        if (listing.sealed === true) {
          sealedPrices.push(price);
        } else {
          usedPrices.push(price);
        }
      }

      if (Number.isFinite(ship) && ship >= 0) {
        shipping.push(ship);
      }
    }

    const sortedPrices = prices.sort((a, b) => a - b);
    const sortedPricesWithShipping = pricesWithShipping.sort((a, b) => a - b);
    const sortedShipping = shipping.sort((a, b) => a - b);

    const confidenceScore =
      listings.length >= 10 ? 0.95 : listings.length >= 5 ? 0.8 : listings.length >= 2 ? 0.65 : 0.45;

    return {
      itemId: item.id,
      scope: 'ua',
      listingsCount: listings.length,
      lowestPrice: sortedPrices.length > 0 ? sortedPrices[0] : null,
      lowestPriceWithShipping: sortedPricesWithShipping.length > 0 ? sortedPricesWithShipping[0] : null,
      avgPrice: avg(prices),
      medianPrice: median(prices),
      avgShipping: avg(shipping),
      minShipping: sortedShipping.length > 0 ? sortedShipping[0] : null,
      maxShipping: sortedShipping.length > 0 ? sortedShipping[sortedShipping.length - 1] : null,
      sealedAvgPrice: avg(sealedPrices),
      usedAvgPrice: avg(usedPrices),
      confidenceScore,
    };
  });

  if (snapshotData.length > 0) {
    await prisma.marketSnapshot.createMany({
      data: snapshotData,
    });
  }

  return {
    totalItems: items.length,
    snapshotsCreated: snapshotData.length,
  };
}