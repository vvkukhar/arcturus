import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MarketModule } from '../market/market.module';
import { ProcurementController } from './procurement.controller';
import { ProcurementService } from './procurement.service';
import { B2BAdapterService } from './b2b-adapter.service';
import { DynamicParserService } from '../market/dynamic-parser.service';

@Module({
  imports: [
    AuthModule,
    ActivityModule,
    NotificationsModule,
    RealtimeModule,
    PrismaModule,
    MarketModule
  ],
  controllers: [ProcurementController],
  providers: [ProcurementService, B2BAdapterService, DynamicParserService],
  exports: [ProcurementService, B2BAdapterService],
})
export class ProcurementModule {}