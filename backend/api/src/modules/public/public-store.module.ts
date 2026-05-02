import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PublicStoreController } from './public-store.controller';
import { PublicStoreService } from './public-store.service';

@Module({
  imports: [AuthModule, ActivityModule, NotificationsModule, RealtimeModule],
  controllers: [PublicStoreController],
  providers: [PublicStoreService],
  exports: [PublicStoreService],
})
export class PublicStoreModule {}