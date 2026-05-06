import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { CompsController } from './comps.controller';
import { CompsService } from './comps.service';

@Module({
  imports: [AuthModule, ActivityModule, RealtimeModule],
  controllers: [CompsController],
  providers: [CompsService],
  exports: [CompsService],
})
export class CompsModule {}