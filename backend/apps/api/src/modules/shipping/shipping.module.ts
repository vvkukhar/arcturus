import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { ActivityModule } from '../activity/activity.module';
import { ShippingController } from './shipping.controller';
import { NovaPoshtaService } from './nova-poshta.service';

@Module({
  imports: [PrismaModule, RealtimeModule, ActivityModule],
  controllers: [ShippingController],
  providers: [NovaPoshtaService],
  exports: [NovaPoshtaService],
})
export class ShippingModule {}