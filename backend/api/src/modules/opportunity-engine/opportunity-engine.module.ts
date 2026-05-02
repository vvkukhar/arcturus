import { Module } from '@nestjs/common';
import { MarketModule } from '../market/market.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { StrategyModule } from '../strategy/strategy.module';
import { OpportunityEngineController } from './opportunity-engine.controller';
import { OpportunityEngineService } from './opportunity-engine.service';

@Module({
  imports: [PrismaModule, MarketModule, StrategyModule, RealtimeModule],
  controllers: [OpportunityEngineController],
  providers: [OpportunityEngineService],
  exports: [OpportunityEngineService],
})
export class OpportunityEngineModule {}