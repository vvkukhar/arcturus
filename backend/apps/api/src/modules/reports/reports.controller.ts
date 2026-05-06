import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ReportsService } from './reports.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('pnl')
  pnl(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<unknown> {
    return this.reportsService.profitAndLoss({
      from,
      to,
    });
  }

  @Get('sales-by-theme')
  salesByTheme(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<unknown[]> {
    return this.reportsService.salesByTheme({
      from,
      to,
    });
  }

  @Get('expenses-by-category')
  expensesByCategory(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<unknown[]> {
    return this.reportsService.expensesByCategory({
      from,
      to,
    });
  }

  @Get('daily-pnl')
  dailyPnl(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<unknown[]> {
    return this.reportsService.dailyPnl({
      from,
      to,
    });
  }

  @Post('snapshot')
  saveSnapshot(
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<unknown> {
    return this.reportsService.saveSnapshot({
      from,
      to,
    });
  }

  @Get('snapshots')
  snapshots(): Promise<unknown[]> {
    return this.reportsService.snapshots();
  }
}