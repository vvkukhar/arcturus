import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { TelegramService } from './telegram.service';
import { TelegramWebhookController } from './telegram-webhook.controller';
import { TelegramWebhookService } from './telegram-webhook.service';
import { NotificationsController } from './notifications.controller';
import { ShippingModule } from '../shipping/shipping.module';

@Global()
@Module({
  imports: [ShippingModule],
  controllers: [TelegramWebhookController, NotificationsController],
  providers: [NotificationsService, TelegramService, TelegramWebhookService],
  exports: [NotificationsService, TelegramService, TelegramWebhookService],
})
export class NotificationsModule {}