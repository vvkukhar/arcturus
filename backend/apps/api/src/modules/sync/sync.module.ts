import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from '../auth/auth.module';
import { DecisionsModule } from '../decisions/decisions.module';
import { MarketModule } from '../market/market.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SyncController } from './sync.controller';
import { SyncOrchestratorService } from './sync-orchestrator.service';
import { SyncService } from './sync.service';
import { SyncStateService } from './sync-state.service';

@Module({
  imports: [
    AuthModule,
    MarketModule,
    DecisionsModule,
    RealtimeModule,
    BullModule.registerQueue({
      name: 'sync',
    }),
  ],
  controllers: [SyncController],
  providers: [SyncService, SyncStateService, SyncOrchestratorService],
  exports: [SyncService, SyncStateService, SyncOrchestratorService],
})
export class SyncModule {}