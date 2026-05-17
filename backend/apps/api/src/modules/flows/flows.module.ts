import { Module } from '@nestjs/common';
import { ActivityModule } from '../activity/activity.module';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { FlowsController } from './flows.controller';
import { FlowsService } from './flows.service';
import { PurchaseFlowController } from './purchase-flow.controller';
import { PurchaseFlowService } from './purchase-flow.service';
import { RepriceFlowController } from './reprice-flow.controller';
import { RepriceFlowService } from './reprice-flow.service';
import { ReviewFlowController } from './review-flow.controller';
import { ReviewFlowService } from './review-flow.service';
import { FlowsEventsService } from './flows-events.service';

@Module({
  imports: [AuthModule, RealtimeModule, ActivityModule],
  controllers: [
    FlowsController,
    PurchaseFlowController,
    RepriceFlowController,
    ReviewFlowController
  ],
  providers: [
    FlowsService,
    PurchaseFlowService,
    RepriceFlowService,
    ReviewFlowService,
    FlowsEventsService
  ],
  exports: [
    FlowsService,
    PurchaseFlowService,
    RepriceFlowService,
    ReviewFlowService
  ],
})
export class FlowsModule {}