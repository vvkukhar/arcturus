import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AllocationService } from './allocation.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('allocation')
export class AllocationController {
  constructor(private readonly allocationService: AllocationService) {}

  @Get()
  allocation(): Promise<unknown> {
    return this.allocationService.getCapitalAllocation();
  }

  @Get('cashflow-plan')
  cashflowPlan(
    @Query('monthlyBudget') monthlyBudget?: string,
    @Query('reinvestPercent') reinvestPercent?: string,
  ): Promise<unknown> {
    return this.allocationService.getCashflowPlan({
      monthlyBudget: monthlyBudget ? Number(monthlyBudget) : undefined,
      reinvestPercent: reinvestPercent ? Number(reinvestPercent) : undefined,
    });
  }
}