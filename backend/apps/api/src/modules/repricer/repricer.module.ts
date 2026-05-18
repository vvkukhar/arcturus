import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { CompsModule } from '../comps/comps.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { StrategyModule } from '../strategy/strategy.module';
import { RepricerController } from './repricer.controller';
import { RepricerService } from './repricer.service';
import { RepricerV2Controller } from './repricer-v2.controller';
import { RepricerV2Service } from './repricer-v2.service';

@Module({
  imports: [
    AuthModule,
    StrategyModule,
    CompsModule,
    ActivityModule,
    RealtimeModule,
  ],
  controllers: [RepricerController, RepricerV2Controller],
  providers: [RepricerService, RepricerV2Service],
  exports: [RepricerService, RepricerV2Service],
})
export class RepricerModule {}