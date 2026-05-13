import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { OrdersModule } from '../orders/orders.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { LiqPayService } from './liqpay.service';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    OrdersModule,
    NotificationsModule,
    RealtimeModule,
    PrismaModule,
    RedisModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, LiqPayService],
  exports: [PaymentsService, LiqPayService],
})
export class PaymentsModule {}