import { prisma } from '../prisma';
import { toMoney } from '@arcturus/shared';

export async function portfolioRebalancingJob(): Promise<{ liquidated: number; reinvested: number; status: string }> {
  console.log('⚖️ Running Automated Capital Rebalancing and Liquidation Engine...');

  // 1. Збираємо фінансову метрику складу
  const activeInventory = await prisma.inventoryItem.findMany({
    where: { quantity: { gt: 0 }, isMarketplace: false },
    include: { sales: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  const now = Date.now();
  const SIXTY_DAYS = 60 * 24 * 60 * 60 * 1000; // 60 днів застою капіталу
  let liquidatedCount = 0;
  let reinvestedCount = 0;

  const dbOperations: any[] = [];

  // 2. Етап розпродажу (Asset Liquidation): зливаємо мертві активи за собівартістю, щоб звільнити кеш
  for (const item of activeInventory) {
    const age = now - new Date(item.createdAt).getTime();
    
    // Якщо набір лежить на складі понад 60 днів без руху — вмикаємо агресивну стратегію виходу
    if (age > SIXTY_DAYS) {
      const currentPrice = Number(item.expectedSalePriceManual ?? item.totalCost * 1.4);
      const liquidationPrice = toMoney(Number(item.totalCost) * 1.05); // Ставимо ціну в +5% від собівартості для миттєвого зливу

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
              reason: `CRITICAL_LIQUIDATION: Asset stale for ${Math.floor(age / (24 * 60 * 60 * 1000))} days`,
            }
          }),
          prisma.activityLog.create({
            data: {
              action: 'strategy.auto_liquidation_triggered',
              payloadJson: { inventoryItemId: item.id, oldPrice: currentPrice, newPrice: liquidationPrice }
            }
          })
        );
        liquidatedCount++;
      }
    }
  }

  // 3. Етап авто-інвестування (Auto-Reinvestment Pipeline)
  // Якщо у нас на балансі є вільні кошти, пускаємо їх у роботу за пріоритетами списку спостереження
  const hotDeals = await prisma.deal.findMany({
    where: { status: 'open', action: 'BUY_NOW' },
    orderBy: { score: 'desc' },
    take: 10,
  });

  if (hotDeals.length > 0) {
    for (const deal of hotDeals) {
      // Автоматично створюємо затверджений закупівельний ордер для найкращих угод
      const existingPo = await prisma.purchaseOrder.findFirst({
        where: { watchlistItemId: deal.watchlistItemId, status: { in: ['planned', 'approved', 'ordered'] } }
      });

      if (!existingPo) {
        const dealKey = `auto_reinvest_${deal.id}_${Date.now()}`;
        
        dbOperations.push(
          prisma.purchaseOrder.create({
            data: {
              id: dealKey,
              itemId: deal.id, // Посилання на deal/item
              watchlistItemId: deal.watchlistItemId,
              titleSnapshot: 'Auto Portfolio Reinvestment',
              status: 'approved', // Статус затверджено — оператор може відразу оплачувати
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

  // Виконуємо всі коригування портфеля транзакційно
  if (dbOperations.length > 0) {
    const chunkSize = 100;
    for (let i = 0; i < dbOperations.length; i += chunkSize) {
      await prisma.$transaction(dbOperations.slice(i, i + chunkSize));
    }
  }

  console.log(`🏁 Portfolio Rebalancing Complete. Stale liquidated: ${liquidatedCount}, Capital auto-routed: ${reinvestedCount}`);
  
  return {
    liquidated: liquidatedCount,
    reinvested: reinvestedCount,
    status: dbOperations.length > 0 ? 'EXECUTED_ADJUSTMENTS' : 'PORTFOLIO_BALANCED'
  };
}