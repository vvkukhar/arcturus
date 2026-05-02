import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { StrategyModule } from '../strategy/strategy.module';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';

@Module({
  imports: [AuthModule, StrategyModule],
  controllers: [PricingController],
  providers: [PricingService],
  exports: [PricingService],
})
export class PricingModule {}