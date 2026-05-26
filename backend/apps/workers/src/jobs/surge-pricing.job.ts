import { prisma } from '../prisma';
import { toMoney } from '@arcturus/shared';

export async function surgePricingJob(activeSessionsMap: Map<string, number>): Promise<{ surged: number }> {
  let surgedCount = 0;
  const dbOperations = [];

  for (const [itemId, viewersCount] of activeSessionsMap.entries()) {
    if (viewersCount < 3) continue;

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { itemId, quantity: { gt: 0 }, isMarketplace: false },
    });

    if (inventoryItems.length === 0) continue;

    for (const item of inventoryItems) {
      const currentPrice = item.expectedSalePriceManual ?? item.totalCost;
      
      let surgeMultiplier = 1;
      if (viewersCount >= 10) surgeMultiplier = 1.15; 
      else if (viewersCount >= 5) surgeMultiplier = 1.08;
      else if (viewersCount >= 3) surgeMultiplier = 1.04;

      const surgedPrice = toMoney(currentPrice * surgeMultiplier);

      if (surgedPrice > currentPrice) {
        dbOperations.push(
          prisma.inventoryItem.update({
            where: { id: item.id },
            data: { expectedSalePriceManual: surgedPrice },
          }),
          prisma.activityLog.create({
            data: {
              action: 'monetization.surge_pricing_applied',
              payloadJson: {
                inventoryItemId: item.id,
                viewersCount,
                oldPrice: currentPrice,
                newPrice: surgedPrice,
              },
            },
          })
        );
        surgedCount++;
      }
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 50;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  return { surged: surgedCount };
}