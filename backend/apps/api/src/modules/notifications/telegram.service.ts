import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly botToken = process.env.TELEGRAM_BOT_TOKEN;
  private readonly chatId = process.env.TELEGRAM_CHAT_ID;
  private readonly apiUrl = 'https://api.telegram.org/bot';
  private readonly backendUrl = process.env.BACKEND_URL || process.env.RENDER_EXTERNAL_URL;

  async onModuleInit() {
    if (this.botToken && this.backendUrl) {
      const webhookUrl = `${this.backendUrl}/api/telegram/webhook`;
      try {
        await fetch(`${this.apiUrl}${this.botToken}/setWebhook?url=${webhookUrl}`);
      } catch (e) {}
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

      if (inlineKeyboard && inlineKeyboard.length > 0) {
        payload.reply_markup = {
          inline_keyboard: inlineKeyboard,
        };
      }

      await fetch(`${this.apiUrl}${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {}
  }

  async sendDealAlert(params: {
    title: string;
    roi: number;
    profit: number;
    buyPrice: number;
    url: string;
  }): Promise<void> {
    const text = `🚨 <b>HOT DEAL DETECTED</b> 🚨\n\n📦 <b>${params.title}</b>\n\n💰 Buy: <b>${params.buyPrice} ₴</b>\n📈 Est. Profit: <b>+${params.profit} ₴</b>\n🔥 ROI: <b>${params.roi}%</b>\n\n⚡ Act fast!`;
    
    const keyboard = [
      [
        {
          text: '🛒 Open Listing',
          url: params.url,
        }
      ]
    ];

    await this.sendMessage(text, keyboard);
  }
}