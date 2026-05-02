import { Body, Controller, Post } from '@nestjs/common';
import {
  CapitalAllocationCandidate,
  CapitalAllocationService,
} from './capital-allocation.service';
import {
  ProfitTrackerService,
  ProfitTrackerTrade,
} from './profit-tracker.service';
import {
  RiskManagementInput,
  RiskManagementService,
} from './risk-management.service';

@Controller('strategy')
export class StrategyController {
  constructor(
    private readonly capitalAllocationService: CapitalAllocationService,
    private readonly riskManagementService: RiskManagementService,
    private readonly profitTrackerService: ProfitTrackerService,
  ) {}

  @Post('allocate')
  allocate(
    @Body()
    body: {
      capital: number;
      candidates: CapitalAllocationCandidate[];
    },
  ) {
    return this.capitalAllocationService.allocate(
      body.capital,
      body.candidates ?? [],
    );
  }

  @Post('risk')
  risk(@Body() body: RiskManagementInput) {
    return this.riskManagementService.evaluate(body);
  }

  @Post('profit')
  profit(
    @Body()
    body: {
      trades: ProfitTrackerTrade[];
    },
  ) {
    return this.profitTrackerService.summarize(body.trades ?? []);
  }
}