import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TelegramService } from './telegram.service';
import { TelegramWebhookController } from './telegram-webhook.controller';
import { TelegramWebhookService } from './telegram-webhook.service';

@Global()
@Module({
  controllers: [TelegramWebhookController],
  providers: [NotificationsService, TelegramService, TelegramWebhookService],
  exports: [NotificationsService, TelegramService, TelegramWebhookService],
})
export class NotificationsModule {}