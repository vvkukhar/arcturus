import { prisma } from '../prisma';

export async function aiSmmBroadcasterJob(): Promise<{ postsGenerated: number }> {
  const publicChannelId = process.env.TELEGRAM_PUBLIC_CHANNEL_ID;
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const openAiKey = process.env.OPENAI_API_KEY;

  if (!publicChannelId || !botToken || !openAiKey) return { postsGenerated: 0 };

  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const hotItems = await prisma.inventoryItem.findMany({
    where: {
      quantity: { gt: 0 },
      isMarketplace: false,
      createdAt: { gt: twentyFourHoursAgo },
      expectedSalePriceManual: { not: null }
    },
    include: { item: true, images: { take: 1, orderBy: { sortOrder: 'asc' } } },
    take: 3,
  });

  let postsGenerated = 0;
  const storeUrl = process.env.PUBLIC_STORE_BASE_URL || 'https://arcturus.store';

  for (const item of hotItems) {
    const alreadyPosted = await prisma.activityLog.findFirst({
      where: { 
        action: 'marketing.smm_post_published', 
        payloadJson: { path: ['inventoryItemId'], equals: item.id } 
      }
    });
    
    if (alreadyPosted) continue;

    const price = item.expectedSalePriceManual ?? item.totalCost;
    const prompt = `Напиши дуже короткий, агресивний та емоційний пост для Telegram-каналу колекціонерів про те, що в нас з'явився рідкісний набір LEGO.
Назва: ${item.titleSnapshot}
Тема: ${item.item.theme || 'LEGO'}
Ціна: ${price} грн.
Стан: ${item.condition === 'new' || item.sealed ? 'Новий, запечатаний' : 'Ідеальний стан'}.
Додай емодзі, створи FOMO (що набір всього один і його заберуть за хвилини). Українською мовою. Без хештегів.`;

    try {
      const aiRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openAiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
        })
      });

      if (!aiRes.ok) continue;
      const aiData = await aiRes.json();
      const text = aiData.choices[0]?.message?.content?.trim();
      if (!text) continue;

      const itemSlug = item.titleSnapshot.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
      const itemUrl = `${storeUrl}/store/catalog/${itemSlug}`;

      const keyboard = [[{ text: '🛒 Купити зараз', url: itemUrl }]];

      const payload: any = {
        chat_id: publicChannelId,
        caption: text,
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: keyboard },
      };

      if (item.images.length > 0) {
        payload.photo = item.images[0].imageUrl;
        await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        payload.text = text;
        delete payload.caption;
        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      postsGenerated++;
      
      await prisma.activityLog.create({
        data: {
          action: 'marketing.smm_post_published',
          payloadJson: { inventoryItemId: item.id, channel: publicChannelId }
        }
      });

    } catch (e) {
      console.error('[AI SMM Broadcaster Error]', e);
    }
  }

  return { postsGenerated };
}