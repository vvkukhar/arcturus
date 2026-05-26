import { prisma } from '../prisma';

export async function monopolySqueezeJob(): Promise<{ squeezedSets: number }> {
  let squeezedSets = 0;
  const dbOperations = [];

  const candidateItems = await prisma.inventoryItem.groupBy({
    by: ['itemId'],
    where: { quantity: { gt: 0 }, isMarketplace: false },
    _sum: { quantity: true }
  });

  for (const candidate of candidateItems) {
    if (!candidate.itemId || !candidate._sum.quantity) continue;
    const ourStock = candidate._sum.quantity;

    const marketSnapshot = await prisma.marketSnapshot.findFirst({
      where: { itemId: candidate.itemId },
      orderBy: { computedAt: 'desc' }
    });

    if (!marketSnapshot) continue;

    const marketListings = await prisma.marketListing.findMany({
      where: { itemId: candidate.itemId, status: 'active' },
      orderBy: { price: 'asc' }
    });

    const totalMarketStock = marketListings.length + ourStock;
    const ourMarketShare = ourStock / totalMarketStock;

    if (ourMarketShare > 0.5 && marketListings.length > 0) {
      let costToSweep = 0;
      const listingsToSweep = [];
      const thresholdPrice = marketSnapshot.medianPrice ? marketSnapshot.medianPrice * 0.9 : Infinity;

      for (const listing of marketListings) {
        if (listing.price <= thresholdPrice) {
          costToSweep += listing.price + (listing.shippingPrice || 0);
          listingsToSweep.push(listing.id);
        }
      }

      if (listingsToSweep.length > 0 && costToSweep < 50000) { 
        dbOperations.push(
          prisma.decisionSnapshot.create({
            data: {
              itemId: candidate.itemId,
              contextType: 'monopoly_squeeze',
              contextId: candidate.itemId,
              action: 'MONOPOLY_BUYOUT',
              score: 95,
              confidence: 0.9,
              reasonPrimary: 'Market Monopoly detected (>50% share)',
              payloadJson: {
                ourMarketShare,
                listingsToSweepCount: listingsToSweep.length,
                costToSweep,
                projectedNewFloor: marketSnapshot.medianPrice ? marketSnapshot.medianPrice * 1.4 : 0
              }
            }
          })
        );
        squeezedSets++;
      }
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 50;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { squeezedSets };
}