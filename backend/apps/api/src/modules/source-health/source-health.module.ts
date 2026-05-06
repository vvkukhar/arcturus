import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { SyncModule } from '../sync/sync.module';
import { SourceHealthController } from './source-health.controller';
import { SourceHealthService } from './source-health.service';
import { SourceRerunService } from './source-rerun.service';

@Module({
  imports: [AuthModule, SyncModule, RealtimeModule],
  controllers: [SourceHealthController],
  providers: [SourceHealthService, SourceRerunService],
  exports: [SourceHealthService, SourceRerunService],
})
export class SourceHealthModule {}