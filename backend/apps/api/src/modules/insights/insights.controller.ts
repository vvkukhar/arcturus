import { Controller, Get, Param, Query } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get('inventory/:inventoryItemId')
  async getInventoryInsight(
    @Param('inventoryItemId') inventoryItemId: string,
  ): Promise<unknown> {
    return this.insightsService.getInventoryInsight(inventoryItemId);
  }

  @Get('watchlist/:watchlistItemId')
  async getWatchlistInsight(
    @Param('watchlistItemId') watchlistItemId: string,
  ): Promise<unknown> {
    return this.insightsService.getWatchlistInsight(watchlistItemId);
  }

  @Get('dashboard')
  async getDashboardInsights(
    @Query('limit') limit?: string,
  ): Promise<unknown> {
    return this.insightsService.getDashboardInsights(limit ? Number(limit) : 20);
  }
}