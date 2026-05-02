import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { CompsModule } from '../comps/comps.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { StrategyModule } from '../strategy/strategy.module';
import { RepricerController } from './repricer.controller';
import { RepricerService } from './repricer.service';

@Module({
  imports: [
    AuthModule,
    StrategyModule,
    CompsModule,
    ActivityModule,
    RealtimeModule,
  ],
  controllers: [RepricerController],
  providers: [RepricerService],
  exports: [RepricerService],
})
export class RepricerModule {}