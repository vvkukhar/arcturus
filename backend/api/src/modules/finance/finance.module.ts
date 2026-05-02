import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FinanceController } from './finance.controller';
import { UnitEconomicsService } from './unit-economics.service';

@Module({
  imports: [AuthModule],
  controllers: [FinanceController],
  providers: [UnitEconomicsService],
  exports: [UnitEconomicsService],
})
export class FinanceModule {}