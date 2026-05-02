import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StrategyModule } from '../strategy/strategy.module';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';

@Module({
  imports: [AuthModule, StrategyModule],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
  exports: [OpportunitiesService],
})
export class OpportunitiesModule {}