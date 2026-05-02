import { Controller, Get, Param, Post } from '@nestjs/common';
import { DecisionsService } from './decisions.service';

@Controller('decisions')
export class DecisionsController {
  constructor(private readonly decisionsService: DecisionsService) {}

  @Post('inventory/:inventoryItemId/recompute')
  async recomputeInventoryDecision(
    @Param('inventoryItemId') inventoryItemId: string,
  ): Promise<unknown> {
    return this.decisionsService.recomputeInventoryDecision(inventoryItemId);
  }

  @Post('watchlist/:watchlistItemId/recompute')
  async recomputeWatchlistDecision(
    @Param('watchlistItemId') watchlistItemId: string,
  ): Promise<unknown> {
    return this.decisionsService.recomputeWatchlistDecision(watchlistItemId);
  }

  @Get('inventory/:inventoryItemId/latest')
  async getLatestInventoryDecision(
    @Param('inventoryItemId') inventoryItemId: string,
  ): Promise<unknown> {
    return this.decisionsService.getLatestInventoryDecision(inventoryItemId);
  }

  @Get('watchlist/:watchlistItemId/latest')
  async getLatestWatchlistDecision(
    @Param('watchlistItemId') watchlistItemId: string,
  ): Promise<unknown> {
    return this.decisionsService.getLatestWatchlistDecision(watchlistItemId);
  }
}