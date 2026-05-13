import { Global, Module } from '@nestjs/common';
import { AutoDecisionEngineService } from './auto-decision-engine.service';
import { FeesEstimatorService } from './fees-estimator.service';
import { ItemTypeService } from './item-type.service';
import { MarginCalculationService } from './margin-calculation.service';
import { MarketAnomalyService } from './market-anomaly.service';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketSnapshotRecomputeService } from './market-snapshot-recompute.service';
import { MarketSnapshotService } from './market-snapshot.service';
import { MarketSyncService } from './market-sync.service';
import { MinifigureLogicService } from './minifigure-logic.service';
import { OpportunityScoreV3Service } from './opportunity-score-v3.service';
import { PriceVolatilityService } from './price-volatility.service';
import { ProfitabilityService } from './profitability.service';
import { RoiCalculatorService } from './roi-calculator.service';
import { ShippingNormalizationService } from './shipping-normalization.service';
import { ShippingRealismService } from './shipping-realism.service';
import { SoldCompsService } from './sold-comps.service';
import { SourceConfidenceService } from './source-confidence.service';
import { SourceFreshnessService } from './source-freshness.service';
import { StaleListingPenaltyService } from './stale-listing-penalty.service';
import { MarketIntelligenceService } from './market-intelligence.service';

@Global()
@Module({
  controllers: [MarketController],
  providers: [
    MarketService,
    MarketSnapshotRecomputeService,
    MarketSnapshotService,
    MarketSyncService,
    ProfitabilityService,
    FeesEstimatorService,
    SourceConfidenceService,
    ShippingRealismService,
    ShippingNormalizationService,
    MarketAnomalyService,
    SoldCompsService,
    OpportunityScoreV3Service,
    ItemTypeService,
    SourceFreshnessService,
    StaleListingPenaltyService,
    MinifigureLogicService,
    PriceVolatilityService,
    MarginCalculationService,
    RoiCalculatorService,
    AutoDecisionEngineService,
    MarketIntelligenceService,
  ],
  exports: [
    MarketService,
    MarketSnapshotRecomputeService,
    MarketSnapshotService,
    MarketSyncService,
    ProfitabilityService,
    FeesEstimatorService,
    SourceConfidenceService,
    ShippingRealismService,
    ShippingNormalizationService,
    MarketAnomalyService,
    SoldCompsService,
    OpportunityScoreV3Service,
    ItemTypeService,
    SourceFreshnessService,
    StaleListingPenaltyService,
    MinifigureLogicService,
    PriceVolatilityService,
    MarginCalculationService,
    RoiCalculatorService,
    AutoDecisionEngineService,
    MarketIntelligenceService,
  ],
})
export class MarketModule {}