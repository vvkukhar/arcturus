import { prisma } from '../prisma';
import { toMoney } from '@arcturus/shared';

export async function zeroTouchMatcherJob(): Promise<{ dropshipAlertsCreated: number }> {
  let dropshipAlertsCreated = 0;

  const pendingReserves = await prisma.reserveRequest.findMany({
    where: { status: 'pending', inventoryItemId: null }
  });

  for (const reserve of pendingReserves) {
    const possibleItems = await prisma.item.findMany({
      where: { title: { contains: reserve.productTitle.split(' ')[0], mode: 'insensitive' } },
      take: 5
    });

    for (const item of possibleItems) {
      const cheapestListing = await prisma.marketListing.findFirst({
        where: { itemId: item.id, status: 'active' },
        orderBy: { price: 'asc' },
        include: { source: true }
      });

      if (!cheapestListing) continue;

      const totalCost = cheapestListing.price + (cheapestListing.shippingPrice || 0);
      const targetSellPrice = toMoney(totalCost * 1.35); 
      const expectedProfit = targetSellPrice - totalCost;

      if (expectedProfit > 300) {
        const exists = await prisma.decisionSnapshot.findFirst({
          where: { contextType: 'zero_touch', contextId: reserve.id }
        });

        if (!exists) {
          await prisma.decisionSnapshot.create({
            data: {
              itemId: item.id,
              contextType: 'zero_touch',
              contextId: reserve.id,
              action: 'APPROVE_DROPSHIP',
              score: 90,
              confidence: 0.85,
              reasonPrimary: `Dropship match: +${expectedProfit} UAH profit`,
              payloadJson: {
                reserveId: reserve.id,
                listingId: cheapestListing.id,
                listingUrl: cheapestListing.url,
                cost: totalCost,
                clientPrice: targetSellPrice,
                profit: expectedProfit
              }
            }
          });
          dropshipAlertsCreated++;
        }
        break;
      }
    }
  }

  return { dropshipAlertsCreated };
}