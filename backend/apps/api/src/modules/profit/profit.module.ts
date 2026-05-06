import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ProfitController } from './profit.controller';
import { ProfitAnalyticsService } from './profit-analytics.service';

@Module({
  imports: [PrismaModule],
  controllers: [ProfitController],
  providers: [ProfitAnalyticsService],
  exports: [ProfitAnalyticsService],
})
export class ProfitModule {}