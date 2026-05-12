import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { FinanceController } from './finance.controller';
import { UnitEconomicsService } from './unit-economics.service';
import { CurrencyService } from './currency.service';
import { CustomsService } from './customs.service';

@Global()
@Module({
  imports: [AuthModule],
  controllers: [FinanceController],
  providers: [UnitEconomicsService, CurrencyService, CustomsService],
  exports: [UnitEconomicsService, CurrencyService, CustomsService],
})
export class FinanceModule {}