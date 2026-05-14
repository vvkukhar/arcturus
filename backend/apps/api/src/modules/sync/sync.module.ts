import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';
import { DecisionsModule } from '../decisions/decisions.module';
import { MarketModule } from '../market/market.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SyncController } from './sync.controller';
import { SyncOrchestratorService } from './sync-orchestrator.service';
import { SyncService } from './sync.service';
import { SyncStateService } from './sync-state.service';
import { QUEUE_NAMES } from '../queue/queue.constants';

@Module({
  imports: [
    AuthModule,
    MarketModule,
    DecisionsModule,
    RealtimeModule,
    PrismaModule,
    RedisModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.SYNC,
    }),
  ],
  controllers: [SyncController],
  providers: [SyncService, SyncStateService, SyncOrchestratorService],
  exports: [SyncService, SyncStateService, SyncOrchestratorService],
})
export class SyncModule {}