import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DashboardService } from './dashboard.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  dashboard(): Promise<unknown> {
    return this.dashboardService.getDashboard();
  }

  @Get('flow-counters')
  flowCounters(): Promise<unknown> {
    return this.dashboardService.getFlowCounters();
  }

  @Get('execution-summary')
  executionSummary(): Promise<unknown> {
    return this.dashboardService.getExecutionSummary();
  }

  @Get('business-snapshot')
  businessSnapshot(): Promise<unknown> {
    return this.dashboardService.getBusinessSnapshot();
  }

  @Get('market-snapshot')
  marketSnapshot(): Promise<unknown> {
    return this.dashboardService.getMarketSnapshot();
  }

  @Get('recent-activity')
  recentActivity(): Promise<unknown[]> {
    return this.dashboardService.getRecentActivity();
  }
}