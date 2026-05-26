import { prisma } from '../prisma';
import { toMoney } from '@arcturus/shared';

export async function dutchAuctionJob(): Promise<{ discountedCount: number }> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const deadStock = await prisma.inventoryItem.findMany({
    where: {
      quantity: { gt: 0 },
      isMarketplace: false,
      createdAt: { lt: ninetyDaysAgo },
      isAuction: false
    }
  });

  let discountedCount = 0;
  const dbOperations = [];

  for (const item of deadStock) {
    const currentPrice = item.expectedSalePriceManual ?? (item.totalCost * 1.5);
    const absoluteFloor = item.totalCost * 1.05; 

    if (currentPrice <= absoluteFloor) continue;

    const discountAmount = toMoney(currentPrice * 0.01); 
    const newPrice = Math.max(absoluteFloor, toMoney(currentPrice - discountAmount));

    if (newPrice < currentPrice) {
      dbOperations.push(
        prisma.inventoryItem.update({
          where: { id: item.id },
          data: { expectedSalePriceManual: newPrice, updatedAt: new Date() }
        }),
        prisma.activityLog.create({
          data: {
            action: 'strategy.dutch_auction_markdown',
            payloadJson: {
              inventoryItemId: item.id,
              oldPrice: currentPrice,
              newPrice
            }
          }
        })
      );
      discountedCount++;
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { discountedCount };
}