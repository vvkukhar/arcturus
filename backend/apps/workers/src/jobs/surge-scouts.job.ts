import { prisma } from '../prisma';

export async function surgeScoutsJob(): Promise<{ surgesCreated: number }> {
  let surgesCreated = 0;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const adminChatId = process.env.TELEGRAM_CHAT_ID;

  await prisma.scoutSurge.deleteMany({
    where: { expiresAt: { lt: new Date() } }
  });

  const pendingReservesAgg = await prisma.reserveRequest.groupBy({
    by: ['productTitle'],
    where: { status: 'pending', inventoryItemId: null },
    _count: true
  });

  const twentyFourHoursFromNow = new Date();
  twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);

  for (const reserve of pendingReservesAgg) {
    const demandCount = reserve._count;
    if (demandCount < 1) continue;

    let multiplier = 1.5;
    if (demandCount >= 5) multiplier = 3.0;
    else if (demandCount >= 3) multiplier = 2.0;

    const existingSurge = await prisma.scoutSurge.findFirst({
      where: { reason: { contains: reserve.productTitle } }
    });

    if (!existingSurge) {
      await prisma.scoutSurge.create({
        data: {
          multiplier,
          reason: `High demand for ${reserve.productTitle}`,
          expiresAt: twentyFourHoursFromNow
        }
      });

      if (botToken && adminChatId) {
        const message = `🔥 <b>СУПЕР-БАУНТІ АКТИВОВАНО!</b> 🔥\n\n` +
                        `Нам терміново потрібен набір: <b>${reserve.productTitle}</b>\n` +
                        `Клієнти вже чекають!\n\n` +
                        `Коефіцієнт винагороди: <b>x${multiplier}</b> 💰\n` +
                        `Діє наступні 24 години. Шукайте лінки на OLX та кидайте сюди!`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: adminChatId, text: message, parse_mode: 'HTML' })
        }).catch(() => {});
      }
      surgesCreated++;
    }
  }

  const hotWatchlist = await prisma.watchlistItem.findMany({
    where: { active: true, priority: { gte: 90 } },
    include: { item: true }
  });

  for (const watch of hotWatchlist) {
    const existingSurge = await prisma.scoutSurge.findFirst({
      where: { itemId: watch.itemId }
    });

    if (!existingSurge) {
      await prisma.scoutSurge.create({
        data: {
          itemId: watch.itemId,
          theme: watch.item.theme,
          multiplier: 2.0,
          reason: `High priority watchlist target`,
          expiresAt: twentyFourHoursFromNow
        }
      });

      if (botToken && adminChatId) {
        const message = `🎯 <b>ПРІОРИТЕТНА ЦІЛЬ</b> 🎯\n\n` +
                        `Шукаємо: <b>${watch.titleSnapshot}</b>\n` +
                        `Серія: ${watch.item.theme || 'LEGO'}\n\n` +
                        `Коефіцієнт винагороди: <b>x2.0</b> 💰\n` +
                        `Ліміт часу: 24 години.`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: adminChatId, text: message, parse_mode: 'HTML' })
        }).catch(() => {});
      }
      surgesCreated++;
    }
  }

  return { surgesCreated };
}