import { Module } from '@nestjs/common';
import { BundleDetectionService } from './bundle-detection.service';
import { DailyPlanService } from './daily-plan.service';
import { FlipStrategyService } from './flip-strategy.service';
import { MinifigureArbitrageService } from './minifigure-arbitrage.service';
import { SmartPricingService } from './smart-pricing.service';

@Module({
  providers: [
    BundleDetectionService,
    DailyPlanService,
    FlipStrategyService,
    MinifigureArbitrageService,
    SmartPricingService,
  ],
  exports: [
    BundleDetectionService,
    DailyPlanService,
    FlipStrategyService,
    MinifigureArbitrageService,
    SmartPricingService,
  ],
})
export class StrategyModule {}