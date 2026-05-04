import { prisma } from '../prisma';

function toMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

export async function recomputeDecisionsJob(): Promise<{
  inventoryEvaluated: number;
  listingsEvaluated: number;
}> {
  const inventory = await prisma.inventoryItem.findMany({
    where: { quantity: { gt: 0 } },
    include: { item: true },
    orderBy: { updatedAt: 'desc' },
    take: 1000,
  });

  const listings = await prisma.marketListing.findMany({
    where: { status: 'active' },
    include: { item: true },
    orderBy: { fetchedAt: 'desc' },
    take: 1000,
  });

  const listingItemIds = [...new Set(listings.map(l => l.itemId))];

  const historicalSales = await prisma.sale.findMany({
    where: { itemId: { in: listingItemIds } },
    select: { itemId: true, sellPrice: true },
  });

  const salesMap = new Map<string, number[]>();
  for (const sale of historicalSales) {
    const arr = salesMap.get(sale.itemId) || [];
    if (sale.sellPrice) arr.push(sale.sellPrice);
    salesMap.set(sale.itemId, arr);
  }

  const dbOperations: any[] = [];
  let inventoryEvaluated = 0;
  let listingsEvaluated = 0;

  for (const inv of inventory) {
    const totalCost = toMoney(Number(inv.totalCost ?? 0));
    const currentExpected = toMoney(Number(inv.expectedSalePriceManual ?? inv.totalCost ?? 0));
    const targetRoiPercent = 35;
    const expectedProfit = toMoney(currentExpected - totalCost);
    const roiPercent = totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

    let action = 'HOLD';
    let score = 50;
    let reasonPrimary = 'Inventory is within normal range';

    if (inv.quantity <= 0) {
      action = 'SOLD_OUT';
      score = 100;
      reasonPrimary = 'No stock remaining';
    } else if (roiPercent < 0) {
      action = 'REPRICE_UP_OR_REVIEW';
      score = 80;
      reasonPrimary = 'Expected profit is negative';
    } else if (roiPercent < targetRoiPercent) {
      action = 'REPRICE_UP';
      score = 70;
      reasonPrimary = 'Expected ROI is below target';
    } else if (roiPercent >= targetRoiPercent * 1.5) {
      action = 'SELL_FAST';
      score = 85;
      reasonPrimary = 'Strong expected ROI; prioritize listing';
    }

    dbOperations.push(
      prisma.decisionSnapshot.create({
        data: {
          itemId: inv.itemId,
          contextType: 'inventory',
          contextId: inv.id,
          action,
          score,
          confidence: 0.8,
          reasonPrimary,
          payloadJson: {
            inventoryItemId: inv.id,
            totalCost,
            currentExpected,
            expectedProfit,
            roiPercent,
            targetRoiPercent,
          },
        },
      })
    );
    inventoryEvaluated += 1;
  }

  for (const listing of listings) {
    const buyPrice = toMoney(Number(listing.price ?? 0));
    const shippingPrice = toMoney(Number(listing.shippingPrice ?? 0));
    const totalCost = toMoney(buyPrice + shippingPrice);

    if (buyPrice <= 0) continue;

    const salesPrices = salesMap.get(listing.itemId) || [];
    const avgSellPrice = salesPrices.length > 0
      ? toMoney(salesPrices.reduce((sum, p) => sum + p, 0) / salesPrices.length)
      : toMoney(totalCost * 1.4);

    const expectedProfit = toMoney(avgSellPrice - totalCost);
    const roiPercent = totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

    let score = 50 + Math.min(30, roiPercent / 2);
    if (expectedProfit < 0) score -= 60;
    if (roiPercent < 15) score -= 25;
    if (roiPercent >= 40) score += 15;
    score = Math.max(0, Math.min(100, toMoney(score)));

    let action = 'WATCH';
    let reasonPrimary = 'Potential deal needs monitoring';

    if (score >= 85) {
      action = 'BUY_NOW';
      reasonPrimary = 'High ROI and strong expected profit';
    } else if (score >= 70) {
      action = 'BUY';
      reasonPrimary = 'Good expected margin';
    } else if (score < 45) {
      action = 'SKIP';
      reasonPrimary = 'Weak economics';
    }

    if (expectedProfit < 0) {
      action = 'SKIP';
      reasonPrimary = 'Expected profit is negative';
    }

    dbOperations.push(
      prisma.decisionSnapshot.create({
        data: {
          itemId: listing.itemId,
          contextType: 'listing',
          contextId: listing.id,
          action,
          score,
          confidence: 0.72,
          reasonPrimary,
          payloadJson: {
            listingId: listing.id,
            buyPrice,
            shippingPrice,
            totalCost,
            avgSellPrice,
            expectedProfit,
            roiPercent,
          },
        },
      })
    );
    listingsEvaluated += 1;
  }

  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      const chunk = dbOperations.slice(i, i + chunkSize);
      await prisma.$transaction(chunk);
    }
  }

  await prisma.activityLog.create({
    data: {
      action: 'worker.decisions.recomputed',
      payloadJson: {
        inventoryEvaluated,
        listingsEvaluated,
      },
    },
  });

  return {
    inventoryEvaluated,
    listingsEvaluated,
  };
}