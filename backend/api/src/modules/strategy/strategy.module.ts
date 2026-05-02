import { Module } from '@nestjs/common';
import { BundleBreakupEstimatorService } from './bundle-breakup-estimator.service';
import { BundleDetectionService } from './bundle-detection.service';
import { CapitalAllocationService } from './capital-allocation.service';
import { DailyPlanService } from './daily-plan.service';
import { FlipStrategyService } from './flip-strategy.service';
import { HoldTimeEstimatorService } from './hold-time-estimator.service';
import { LiquidityRankService } from './liquidity-rank.service';
import { MinifigureArbitrageService } from './minifigure-arbitrage.service';
import { MinifigurePricingService } from './minifigure-pricing.service';
import { PartOutEstimatorService } from './part-out-estimator.service';
import { ProfitTrackerService } from './profit-tracker.service';
import { RiskManagementService } from './risk-management.service';
import { SmartPricingService } from './smart-pricing.service';
import { StrategyController } from './strategy.controller';

@Module({
  controllers: [StrategyController],
  providers: [
    BundleBreakupEstimatorService,
    BundleDetectionService,
    CapitalAllocationService,
    DailyPlanService,
    FlipStrategyService,
    HoldTimeEstimatorService,
    LiquidityRankService,
    MinifigureArbitrageService,
    MinifigurePricingService,
    PartOutEstimatorService,
    ProfitTrackerService,
    RiskManagementService,
    SmartPricingService,
  ],
  exports: [
    BundleBreakupEstimatorService,
    BundleDetectionService,
    CapitalAllocationService,
    DailyPlanService,
    FlipStrategyService,
    HoldTimeEstimatorService,
    LiquidityRankService,
    MinifigureArbitrageService,
    MinifigurePricingService,
    PartOutEstimatorService,
    ProfitTrackerService,
    RiskManagementService,
    SmartPricingService,
  ],
})
export class StrategyModule {}