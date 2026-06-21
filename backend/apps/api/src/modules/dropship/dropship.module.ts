import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DropshipController } from './dropship.controller';
import { DropshipService } from './dropship.service';
import { AuthModule } from '../auth/auth.module';
import { PaymentsModule } from '../payments/payments.module';
import { RealtimeModule } from '../realtime/realtime.module'; // 🔥 ДОДАЛИ
import { RedisModule } from '../redis/redis.module'; // 🔥 ДОДАЛИ

@Module({
  imports: [PrismaModule, AuthModule, PaymentsModule, RealtimeModule, RedisModule],
  controllers: [DropshipController],
  providers: [DropshipService],
})
export class DropshipModule {}