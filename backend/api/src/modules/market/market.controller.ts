import { Controller, Get, Param, Post } from '@nestjs/common';
import { MarketService } from './market.service';
import { MarketSyncService } from './market-sync.service';
import { MarketIntelligenceService } from './market-intelligence.service';

@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly marketSyncService: MarketSyncService,
    private readonly intelligence: MarketIntelligenceService,
  ) {}

  @Get('item/:itemId/snapshot')
  async getLatestSnapshot(@Param('itemId') itemId: string): Promise<unknown> {
    return this.marketService.getLatestSnapshot(itemId);
  }

  @Get('item/:itemId/listings')
  async getListings(@Param('itemId') itemId: string): Promise<unknown[]> {
    return this.marketService.getListings(itemId);
  }

  @Get('item/:itemId/intelligence')
  async getItemIntelligence(@Param('itemId') itemId: string): Promise<unknown> {
    return this.intelligence.getItemIntelligence(itemId);
  }

  @Post('item/:itemId/refresh')
  async refreshItemSnapshot(@Param('itemId') itemId: string): Promise<unknown> {
    return this.marketSyncService.refreshItemSnapshot(itemId);
  }

  @Post('inventory/:inventoryItemId/refresh')
  async refreshInventoryItemSnapshot(
    @Param('inventoryItemId') inventoryItemId: string,
  ): Promise<unknown> {
    return this.marketSyncService.refreshInventoryItemSnapshot(inventoryItemId);
  }

  @Post('watchlist/:watchlistItemId/refresh')
  async refreshWatchlistItemSnapshot(
    @Param('watchlistItemId') watchlistItemId: string,
  ): Promise<unknown> {
    return this.marketSyncService.refreshWatchlistItemSnapshot(watchlistItemId);
  }
}