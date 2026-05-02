import { Controller, Get, Query } from '@nestjs/common';
import { ProfitAnalyticsService } from './profit-analytics.service';

@Controller('profit')
export class ProfitController {
  constructor(private readonly profit: ProfitAnalyticsService) {}

  @Get('summary')
  getSummary(): Promise<unknown> {
    return this.profit.getSummary();
  }

  @Get('monthly')
  getMonthly(): Promise<unknown[]> {
    return this.profit.getMonthlyBreakdown();
  }

  @Get('by-theme')
  getByTheme(): Promise<unknown[]> {
    return this.profit.getProfitByTheme();
  }

  @Get('velocity')
  getVelocity(
    @Query('days') days?: string,
  ): Promise<unknown> {
    return this.profit.getSalesVelocity(days ? Number(days) : 30);
  }
}