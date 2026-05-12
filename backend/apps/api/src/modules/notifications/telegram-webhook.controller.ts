import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { TelegramWebhookService } from './telegram-webhook.service';
import { TelegramWebhookGuard } from './telegram-webhook.guard';

@Controller('telegram')
export class TelegramWebhookController {
  constructor(private readonly webhookService: TelegramWebhookService) {}

  @Post('webhook')
  @UseGuards(TelegramWebhookGuard)
  @HttpCode(HttpStatus.OK)
  async handleWebhook(@Body() body: any) {
    if (body?.message) {
      await this.webhookService.processMessage(body.message);
    } else if (body?.callback_query) {
      await this.webhookService.processCallback(body.callback_query);
    }
    return { ok: true };
  }
}