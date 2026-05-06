import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryExportController } from './inventory-export.controller';
import { InventoryExportService } from './inventory-export.service';

@Module({
  imports: [AuthModule, RealtimeModule, ActivityModule, NotificationsModule],
  controllers: [InventoryController, InventoryExportController],
  providers: [InventoryService, InventoryExportService],
  exports: [InventoryService, InventoryExportService],
})
export class InventoryModule {}