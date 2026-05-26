import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { RealtimeGateway } from './realtime.gateway';
import { PrismaModule } from '../prisma/prisma.module';
import { QUEUE_NAMES } from '../queue/queue.constants';

@Global()
@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.MARKET,
    }),
  ],
  providers: [RealtimeGateway],
  exports: [RealtimeGateway],
})
export class RealtimeModule {}