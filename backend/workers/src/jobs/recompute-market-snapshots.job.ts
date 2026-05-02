import { convertToUah } from '../common/currency-converter';
import { avg, median } from '../common/money';
import { prisma } from '../prisma';

function confidenceFromCount(count: number): number {
  if (count >= 10) return 0.95;
  if (count >= 5) return 0.8;
  if (count >= 2) return 0.65;
  if (count >= 1) return 0.45;
  return 0;
}

export async function recomputeMarketSnapshotsJob(): Promise<{
  totalItems: number;
  snapshotsCreated: number;
}> {
  const items = await prisma.item.findMany({
    select: {
      id: true,
    },
  });

  let snapshotsCreated = 0;

  for (const item of items) {
    const listings = await prisma.marketListing.findMany({
      where: {
        itemId: item.id,
        status: 'active',
      },
    });

    if (listings.length === 0) {
      await prisma.marketSnapshot.create({
        data: {
          itemId: item.id,
          scope: 'ua',
          listingsCount: 0,
          confidenceScore: 0,
        },
      });

      snapshotsCreated += 1;
      continue;
    }

    const prices = listings
      .map((listing) => convertToUah(listing.price, listing.currency))
      .filter((value) => Number.isFinite(value) && value > 0);

    const pricesWithShipping = listings
      .map((listing) => {
        const price = convertToUah(listing.price, listing.currency);
        const shipping = convertToUah(
          listing.shippingPrice ?? 0,
          listing.shippingCurrency ?? listing.currency,
        );

        return price + shipping;
      })
      .filter((value) => Number.isFinite(value) && value > 0);

    const shipping = listings
      .map((listing) =>
        convertToUah(
          listing.shippingPrice ?? 0,
          listing.shippingCurrency ?? listing.currency,
        ),
      )
      .filter((value) => Number.isFinite(value) && value >= 0);

    const sealedPrices = listings
      .filter((listing) => listing.sealed === true)
      .map((listing) => convertToUah(listing.price, listing.currency))
      .filter((value) => Number.isFinite(value) && value > 0);

    const usedPrices = listings
      .filter((listing) => listing.sealed !== true)
      .map((listing) => convertToUah(listing.price, listing.currency))
      .filter((value) => Number.isFinite(value) && value > 0);

    await prisma.marketSnapshot.create({
      data: {
        itemId: item.id,
        scope: 'ua',
        listingsCount: listings.length,
        lowestPrice: prices.length > 0 ? Math.min(...prices) : null,
        lowestPriceWithShipping:
          pricesWithShipping.length > 0
            ? Math.min(...pricesWithShipping)
            : null,
        avgPrice: avg(prices),
        medianPrice: median(prices),
        avgShipping: avg(shipping),
        minShipping: shipping.length > 0 ? Math.min(...shipping) : null,
        maxShipping: shipping.length > 0 ? Math.max(...shipping) : null,
        sealedAvgPrice: avg(sealedPrices),
        usedAvgPrice: avg(usedPrices),
        confidenceScore: confidenceFromCount(listings.length),
      },
    });

    snapshotsCreated += 1;
  }

  return {
    totalItems: items.length,
    snapshotsCreated,
  };
}