import { prisma } from '../prisma';
import { OpenAiService } from '@arcturus/api/src/modules/ai/openai.service';
import { TelegramService } from '@arcturus/api/src/modules/notifications/telegram.service';
import { ConfigService } from '@nestjs/config';
import { RedisService } from '@arcturus/api/src/modules/redis/redis.service';

export async function aiSmmBroadcasterJob(): Promise<{ postsGenerated: number }> {
  const config = new ConfigService();
  const ai = new OpenAiService(config);
  const redis = new RedisService();
  const telegram = new TelegramService(redis);

  const publicChannelId = process.env.TELEGRAM_PUBLIC_CHANNEL_ID;
  if (!publicChannelId) return { postsGenerated: 0 };

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
    const cacheKey = `smm_posted_${item.id}`;
    const alreadyPosted = await redis.get(cacheKey);
    if (alreadyPosted) continue;

    const price = item.expectedSalePriceManual ?? item.totalCost;
    const prompt = `Напиши дуже короткий, агресивний та емоційний пост для Telegram-каналу колекціонерів про те, що в нас з'явився рідкісний набір LEGO.
Назва: ${item.titleSnapshot}
Тема: ${item.item.theme || 'LEGO'}
Ціна: ${price} грн.
Стан: ${item.condition === 'new' || item.sealed ? 'Новий, запечатаний' : 'Ідеальний стан'}.
Додай емодзі, створи FOMO (що набір всього один і його заберуть за хвилини). Українською мовою. Без хештегів.`;

    try {
      const response = await ai['openai'].chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
      });

      const text = response.choices[0].message.content?.trim();
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
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        payload.text = text;
        delete payload.caption;
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      await redis.set(cacheKey, 'true', 30 * 24 * 60 * 60);
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