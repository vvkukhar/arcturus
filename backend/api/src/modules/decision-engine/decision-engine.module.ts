import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { FinanceModule } from '../finance/finance.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { DecisionActionService } from './decision-action.service';
import { DecisionEngineController } from './decision-engine.controller';
import { DecisionEngineService } from './decision-engine.service';

@Module({
  imports: [
    AuthModule,
    ActivityModule,
    RealtimeModule,
    FinanceModule,
    NotificationsModule,
  ],
  controllers: [DecisionEngineController],
  providers: [DecisionEngineService, DecisionActionService],
  exports: [DecisionEngineService, DecisionActionService],
})
export class DecisionEngineModule {}