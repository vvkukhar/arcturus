import { prisma } from '../prisma';

function toMoney(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(2));
}

type SaleRow = {
  sellPrice: number;
};

async function evaluateInventoryItem(inventoryItemId: string): Promise<unknown> {
  const inventory = await prisma.inventoryItem.findUnique({
    where: {
      id: inventoryItemId,
    },
    include: {
      item: true,
    },
  });

  if (!inventory) {
    return null;
  }

  const totalCost = toMoney(Number(inventory.totalCost ?? 0));
  const currentExpected = toMoney(
    Number(inventory.expectedSalePriceManual ?? inventory.totalCost ?? 0),
  );

  const targetRoiPercent = 35;
  const expectedProfit = toMoney(currentExpected - totalCost);
  const roiPercent =
    totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

  let action = 'HOLD';
  let score = 50;
  let reasonPrimary = 'Inventory is within normal range';

  if (inventory.quantity <= 0) {
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

  return prisma.decisionSnapshot.create({
    data: {
      itemId: inventory.itemId,
      contextType: 'inventory',
      contextId: inventory.id,
      action,
      score,
      confidence: 0.8,
      reasonPrimary,
      reasonSecondary: null,
      payloadJson: {
        inventoryItemId: inventory.id,
        totalCost,
        currentExpected,
        expectedProfit,
        roiPercent,
        targetRoiPercent,
      },
    },
  });
}

async function evaluateListing(listingId: string): Promise<unknown> {
  const listing = await prisma.marketListing.findUnique({
    where: {
      id: listingId,
    },
    include: {
      item: true,
    },
  });

  if (!listing) {
    return null;
  }

  const buyPrice = toMoney(Number(listing.price ?? 0));
  const shippingPrice = toMoney(Number(listing.shippingPrice ?? 0));
  const totalCost = toMoney(buyPrice + shippingPrice);

  if (buyPrice <= 0) {
    return null;
  }

  const historicalSales: SaleRow[] = await prisma.sale.findMany({
    where: {
      itemId: listing.itemId,
    },
    select: {
      sellPrice: true,
    },
  });

  const avgSellPrice =
    historicalSales.length > 0
      ? toMoney(
          historicalSales.reduce(
            (sum: number, sale: SaleRow) =>
              sum + Number(sale.sellPrice ?? 0),
            0,
          ) / historicalSales.length,
        )
      : toMoney(totalCost * 1.4);

  const expectedProfit = toMoney(avgSellPrice - totalCost);
  const roiPercent =
    totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

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

  return prisma.decisionSnapshot.create({
    data: {
      itemId: listing.itemId,
      contextType: 'listing',
      contextId: listing.id,
      action,
      score,
      confidence: 0.72,
      reasonPrimary,
      reasonSecondary: null,
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
  });
}

export async function recomputeDecisionsJob(): Promise<{
  inventoryEvaluated: number;
  listingsEvaluated: number;
}> {
  const inventory = await prisma.inventoryItem.findMany({
    where: {
      quantity: {
        gt: 0,
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
    take: 200,
  });

  const listings = await prisma.marketListing.findMany({
    where: {
      status: 'active',
    },
    orderBy: {
      fetchedAt: 'desc',
    },
    take: 200,
  });

  let inventoryEvaluated = 0;
  let listingsEvaluated = 0;

  for (const row of inventory) {
    const result = await evaluateInventoryItem(row.id);
    if (result) inventoryEvaluated += 1;
  }

  for (const listing of listings) {
    const result = await evaluateListing(listing.id);
    if (result) listingsEvaluated += 1;
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