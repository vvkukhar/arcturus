import { prisma } from '../prisma';
import { TelegramService } from '@arcturus/api/src/modules/notifications/telegram.service';
import { RedisService } from '@arcturus/api/src/modules/redis/redis.service';

export async function ltvMaximizerJob(): Promise<{ messagesSent: number }> {
  const redis = new RedisService();
  const telegram = new TelegramService(redis);
  let messagesSent = 0;

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
    const cacheKey = `ltv_sent_${tgUsername}`;
    const alreadySent = await redis.get(cacheKey);
    if (alreadySent) continue;

    const favoriteTheme = order.inventoryItem?.item?.theme;
    if (!favoriteTheme) continue;

    const recommendation = activeInventory.find(inv => inv.item.theme === favoriteTheme && inv.itemId !== order.inventoryItem?.itemId);

    if (recommendation) {
      const price = recommendation.expectedSalePriceManual ?? recommendation.totalCost;
      const discountPrice = Math.round(price * 0.95); // 5% personal discount

      const msg = `Вітаю, ${order.buyerName.split(' ')[0]}! 👋\n\n` +
                  `Ви купували у нас набір серії ${favoriteTheme}. Ми щойно отримали ексклюзивний <b>${recommendation.titleSnapshot}</b>.\n\n` +
                  `Для вас як для нашого клієнта є персональна знижка 5%. Віддамо за <b>${discountPrice} ₴</b> замість ${price} ₴.\n\n` +
                  `Забронювати для вас? Напишіть "+" у відповідь.`;

      const adminChatId = process.env.TELEGRAM_CHAT_ID;
      if (adminChatId) {
        await telegram.sendMessage(`[LTV AI] Пропоную надіслати клієнту ${tgUsername}:\n\n${msg}`);
      }

      await redis.set(cacheKey, 'true', 60 * 24 * 60 * 60); 
      messagesSent++;
    }
  }

  return { messagesSent };
}