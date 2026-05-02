import { Module } from '@nestjs/common';
import { MarketModule } from '../market/market.module';
import { PrismaModule } from '../prisma/prisma.module';
import { StrategyModule } from '../strategy/strategy.module';
import { InsightsController } from './insights.controller';
import { InsightsService } from './insights.service';

@Module({
  imports: [PrismaModule, MarketModule, StrategyModule],
  controllers: [InsightsController],
  providers: [InsightsService],
  exports: [InsightsService],
})
export class InsightsModule {}