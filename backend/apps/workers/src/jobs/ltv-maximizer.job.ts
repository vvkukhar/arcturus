import { prisma } from '../prisma';

export async function ltvMaximizerJob(): Promise<{ messagesSent: number }> {
  let messagesSent = 0;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !adminChatId) return { messagesSent: 0 };

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const pastOrders = await prisma.order.findMany({
    where: { 
      status: { in: ['sold', 'paid'] },
      createdAt: { lt: thirtyDaysAgo }
    },
    include: { inventoryItem: { include: { item: true } } }
  });

  const activeInventory = await prisma.inventoryItem.findMany({
    where: { quantity: { gt: 0 }, isMarketplace: false },
    include: { item: true }
  });

  for (const order of pastOrders) {
    if (!order.contact.includes('@')) continue; 
    
    const tgUsername = order.contact;
    
    const alreadySent = await prisma.activityLog.findFirst({
      where: { action: 'marketing.ltv_sent', payloadJson: { path: ['tgUsername'], equals: tgUsername } }
    });
    
    if (alreadySent) continue;

    const favoriteTheme = order.inventoryItem?.item?.theme;
    if (!favoriteTheme) continue;

    const recommendation = activeInventory.find(inv => inv.item.theme === favoriteTheme && inv.itemId !== order.inventoryItem?.itemId);

    if (recommendation) {
      const price = recommendation.expectedSalePriceManual ?? recommendation.totalCost;
      const discountPrice = Math.round(price * 0.95);

      const msg = `Вітаю, ${order.buyerName.split(' ')[0]}! 👋\n\n` +
                  `Ви купували у нас набір серії ${favoriteTheme}. Ми щойно отримали ексклюзивний <b>${recommendation.titleSnapshot}</b>.\n\n` +
                  `Для вас як для нашого клієнта є персональна знижка 5%. Віддамо за <b>${discountPrice} ₴</b> замість ${price} ₴.\n\n` +
                  `Забронювати для вас? Напишіть "+" у відповідь.`;

      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: adminChatId,
          text: `[LTV AI] Пропоную надіслати клієнту ${tgUsername}:\n\n${msg}`,
          parse_mode: 'HTML'
        })
      });

      await prisma.activityLog.create({
        data: {
          action: 'marketing.ltv_sent',
          payloadJson: { tgUsername, recommendationId: recommendation.id }
        }
      });
      
      messagesSent++;
    }
  }

  return { messagesSent };
}