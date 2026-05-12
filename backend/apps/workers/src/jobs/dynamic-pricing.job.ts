import { prisma } from '../prisma';

function toMoney(value: number): number {
  return Number(value.toFixed(2));
}

export async function dynamicPricingJob(): Promise<{ adjusted: number }> {
  const activeInventory = await prisma.inventoryItem.findMany({
    where: { quantity: { gt: 0 } },
    include: { sales: { orderBy: { createdAt: 'desc' }, take: 1 } },
  });

  let adjustedCount = 0;
  const dbOperations = [];

  const now = Date.now();
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

  for (const item of activeInventory) {
    const currentPrice = Number(item.expectedSalePriceManual ?? item.totalCost);
    if (currentPrice <= 0) continue;

    const timeSinceAcquired = now - new Date(item.createdAt).getTime();
    const timeSinceLastSale = item.sales.length > 0 
      ? now - new Date(item.sales[0].createdAt).getTime() 
      : timeSinceAcquired;

    let newPrice = currentPrice;
    let reason = '';

    if (timeSinceLastSale < SEVEN_DAYS && item.quantity <= 2) {
      newPrice = currentPrice * 1.04;
      reason = 'High velocity, low stock (Premium bump)';
    } 
    else if (timeSinceLastSale > THIRTY_DAYS) {
      const minProfitable = Number(item.totalCost) * 1.15;
      newPrice = Math.max(minProfitable, currentPrice * 0.95);
      reason = 'Stagnant inventory (Liquidity discount)';
    }

    newPrice = toMoney(newPrice);

    if (newPrice !== currentPrice) {
      dbOperations.push(
        prisma.inventoryItem.update({
          where: { id: item.id },
          data: { expectedSalePriceManual: newPrice },
        }),
        prisma.activityLog.create({
          data: {
            action: 'system.dynamic_pricing',
            payloadJson: { inventoryItemId: item.id, oldPrice: currentPrice, newPrice, reason }
          }
        })
      );
      adjustedCount++;
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 50;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { adjusted: adjustedCount };
}