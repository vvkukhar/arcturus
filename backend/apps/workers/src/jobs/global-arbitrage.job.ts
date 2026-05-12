import { prisma } from '../prisma';
import { fetchLiveExchangeRates, convertCurrency } from '@arcturus/shared';

export async function globalArbitrageJob(): Promise<{ evaluated: number; opportunitiesFound: number }> {
  const foreignListings = await prisma.marketListing.findMany({
    where: { 
      status: 'active',
      currency: { not: 'UAH' }
    },
    include: { item: true, source: true },
    orderBy: { fetchedAt: 'desc' },
    take: 1500,
  });

  if (foreignListings.length === 0) return { evaluated: 0, opportunitiesFound: 0 };

  let evaluated = 0;
  let opportunitiesFound = 0;
  const dbOperations = [];
  const rates = await fetchLiveExchangeRates();

  for (const listing of foreignListings) {
    evaluated++;

    const baseUah = convertCurrency(Number(listing.price), listing.currency, 'UAH', rates);
    const shippingOriginal = Number(listing.shippingPrice || (listing.sourceCode === 'bricklink' ? 15 : 20));
    const shippingUah = convertCurrency(shippingOriginal, listing.shippingCurrency || listing.currency, 'UAH', rates);
    
    const baseEur = convertCurrency(baseUah, 'UAH', 'EUR', rates);
    let dutyUah = 0;
    let vatUah = 0;

    if (baseEur > 150) {
      const taxableUah = convertCurrency(baseEur - 150, 'EUR', 'UAH', rates);
      dutyUah = taxableUah * 0.10;
      vatUah = (taxableUah + dutyUah) * 0.20;
    }

    const totalLandedUah = Number((baseUah + shippingUah + dutyUah + vatUah).toFixed(2));

    const localSnapshot = await prisma.marketSnapshot.findFirst({
      where: { itemId: listing.itemId, scope: 'ua' },
      orderBy: { computedAt: 'desc' },
    });

    const localSellPrice = Number(localSnapshot?.medianPrice ?? localSnapshot?.avgPrice ?? 0);
    
    if (!localSellPrice || localSellPrice <= 0) continue;

    const netProfit = localSellPrice - totalLandedUah;
    const roi = (netProfit / totalLandedUah) * 100;

    if (roi >= 25 && netProfit >= 300) {
      dbOperations.push(
        prisma.decisionSnapshot.create({
          data: {
            itemId: listing.itemId,
            contextType: 'global_arbitrage',
            contextId: listing.id,
            action: roi >= 40 ? 'IMPORT_STRONG' : 'IMPORT',
            score: Math.min(100, 50 + (roi / 2)),
            confidence: Number(localSnapshot?.confidenceScore ?? 0.5),
            reasonPrimary: `Global arbitrage: +${netProfit.toFixed(0)} UAH profit`,
            payloadJson: {
              listingId: listing.id,
              url: listing.url,
              currency: listing.currency,
              priceOriginal: listing.price,
              baseUah: Number(baseUah.toFixed(2)),
              shippingUah: Number(shippingUah.toFixed(2)),
              taxUah: Number((dutyUah + vatUah).toFixed(2)),
              totalLandedUah,
              localSellPrice,
              roi,
              netProfit,
            }
          }
        })
      );
      opportunitiesFound++;
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { evaluated, opportunitiesFound };
}