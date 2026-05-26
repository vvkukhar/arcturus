import { prisma } from '../prisma';

function toMoney(value: number): number {
  return Number.isFinite(value) ? Number(value.toFixed(2)) : 0;
}

export async function portfolioRebalancingJob(): Promise<{ liquidated: number; reinvested: number; status: string }> {
  console.log('⚖️ Running Automated Capital Rebalancing and Liquidation Engine...');

  const activeInventory = await prisma.inventoryItem.findMany({
    where: { quantity: { gt: 0 }, isMarketplace: false },
    include: { sales: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  const now = Date.now();
  const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000; 
  const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
  
  let liquidatedCount = 0;
  let reinvestedCount = 0;
  const dbOperations: any[] = [];

  for (const item of activeInventory) {
    const age = now - new Date(item.createdAt).getTime();
    
    if (age > SIXTY_DAYS) {
      const weeksOverdue = Math.floor((age - SIXTY_DAYS) / SEVEN_DAYS);
      const discountMultiplier = Math.max(0.75, 1 - (weeksOverdue * 0.05)); 
      
      const currentPrice = Number(item.expectedSalePriceManual ?? item.totalCost * 1.4);
      const liquidationPrice = toMoney(Number(item.totalCost) * discountMultiplier);

      if (currentPrice > liquidationPrice) {
        dbOperations.push(
          prisma.inventoryItem.update({
            where: { id: item.id },
            data: { expectedSalePriceManual: liquidationPrice },
          }),
          prisma.repriceFlowItem.create({
            data: {
              inventoryItemId: item.id,
              currentPrice,
              suggestedPrice: liquidationPrice,
              status: 'listed',
              reason: `CRITICAL_LIQUIDATION: Stale for ${Math.floor(age / (24 * 60 * 60 * 1000))} days. Auto-discounted.`,
            }
          }),
          prisma.activityLog.create({
            data: {
              action: 'strategy.auto_liquidation_triggered',
              payloadJson: { inventoryItemId: item.id, oldPrice: currentPrice, newPrice: liquidationPrice, weeksOverdue }
            }
          })
        );
        liquidatedCount++;
      }
    }
  }

  const hotDeals = await prisma.deal.findMany({
    where: { status: 'open', action: 'BUY_NOW' },
    orderBy: { score: 'desc' },
    take: 10,
    include: { watchlistItem: true }
  });

  if (hotDeals.length > 0) {
    for (const deal of hotDeals) {
      if (!deal.watchlistItem) continue; 
      
      const existingPo = await prisma.purchaseOrder.findFirst({
        where: { watchlistItemId: deal.watchlistItemId, status: { in: ['planned', 'approved', 'ordered'] } }
      });

      if (!existingPo) {
        const dealKey = `auto_reinvest_${deal.id}_${Date.now()}`;
        
        dbOperations.push(
          prisma.purchaseOrder.create({
            data: {
              id: dealKey,
              itemId: deal.watchlistItem.itemId,
              watchlistItemId: deal.watchlistItemId,
              titleSnapshot: 'Auto Portfolio Reinvestment',
              status: 'approved',
              plannedPrice: deal.buyPrice,
              actualPrice: deal.buyPrice,
              totalCost: deal.buyPrice,
              targetSellPrice: deal.targetSellPrice,
              notes: `AUTO_REINVEST: High-score sniper target (${deal.score} pts)`,
            }
          }),
          prisma.purchaseFlowItem.create({
            data: {
              watchlistItemId: deal.watchlistItemId,
              selectedPrice: deal.buyPrice,
              status: 'pending',
              reason: `Portfolio Rebalancer: Auto-routed capital into high-ROI asset`,
            }
          })
        );
        reinvestedCount++;
      }
    }
  }

  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  console.log(`🏁 Portfolio Rebalancing Complete. Stale discounted: ${liquidatedCount}, Capital auto-routed: ${reinvestedCount}`);
  
  return {
    liquidated: liquidatedCount,
    reinvested: reinvestedCount,
    status: dbOperations.length > 0 ? 'EXECUTED_ADJUSTMENTS' : 'PORTFOLIO_BALANCED'
  };
}