import { Injectable, OnModuleInit } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;
  private readonly apiUrl = 'https://api.telegram.org/bot';
  private readonly backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;

  constructor(private readonly redis: RedisService) {}

  async onModuleInit() {
    if (this.botToken && this.backendUrl) {
      const webhookUrl = `${this.backendUrl}/api/v1/telegram/webhook`;
      const cacheKey = 'telegram_webhook_set';
      const isSet = await this.redis.get<string>(cacheKey);

      if (isSet !== webhookUrl) {
        try {
          await fetch(`${this.apiUrl}${this.botToken}/setWebhook?url=${webhookUrl}`);
          await this.redis.set(cacheKey, webhookUrl, 86400 * 7);
        } catch (e) {
          console.error('[Telegram] Failed to set webhook', e);
        }
      }
    }
  }

  async sendMessage(text: string, inlineKeyboard?: any[]): Promise<void> {
    if (!this.botToken || !this.chatId) return;

    try {
      const payload: any = {
        chat_id: this.chatId,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      };

      if (inlineKeyboard) {
        payload.reply_markup = { inline_keyboard: inlineKeyboard };
      }

      await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error('[Telegram] Error sending message', error);
    }
  }

  async editMessage(chatId: string, messageId: number, text: string): Promise<void> {
    await fetch(`${this.apiUrl}${this.botToken}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'HTML' }),
    });
  }

  async sendDealAlert(deal: { title: string; roi: number; profit: number; buyPrice: number; url: string; id?: string }) {
    const text = `🔥 <b>HOT DEAL ALARM</b> 🔥\n\n` +
                 `📦 <b>${deal.title}</b>\n` +
                 `💰 Ціна: <b>${deal.buyPrice} ₴</b>\n` +
                 `📈 ROI: <b>${deal.roi}%</b> (+${deal.profit} ₴)\n\n` +
                 `Лінк: ${deal.url}`;
    
    const keyboard = deal.id ? [
      [
        { text: '✅ Додати в Закупівлі', callback_data: `deal_buy_${deal.id}` },
        { text: '❌ Скіп', callback_data: `deal_skip_${deal.id}` }
      ]
    ] : [];

    await this.sendMessage(text, keyboard);
  }

  async sendOrderAlert(order: { id: string; title: string; price: number; client: string; phone: string; note: string }) {
    const text = `🛒 <b>НОВЕ ЗАМОВЛЕННЯ</b>\n\n` +
                 `📦 <b>${order.title}</b>\n` +
                 `💰 Сума: <b>${order.price} ₴</b>\n` +
                 `👤 Клієнт: ${order.client} (${order.phone})\n` +
                 `📍 Доставка: ${order.note}`;

    const keyboard = [
      [
        { text: '🚚 Згенерувати ТТН (НП)', callback_data: `order_ttn_${order.id}` },
      ],
      [
        { text: '❌ Скасувати', callback_data: `order_cancel_${order.id}` }
      ]
    ];

    await this.sendMessage(text, keyboard);
  }
}