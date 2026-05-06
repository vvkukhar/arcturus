import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { InventorySearchService } from './inventory-search.service';
import { InventoryStatsService } from './inventory-stats.service';

@Controller('inventory-admin')
@UseGuards(AuthGuard)
export class InventoryAdminController {
  constructor(
    private readonly searchService: InventorySearchService,
    private readonly statsService: InventoryStatsService,
  ) {}

  @Get('search')
  search(
    @Query('q') q?: string,
    @Query('theme') theme?: string,
    @Query('kind') kind?: string,
    @Query('condition') condition?: string,
    @Query('sealed') sealed?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('inStockOnly') inStockOnly?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.searchService.search({
      q,
      theme,
      kind,
      condition,
      sealed: sealed == null ? undefined : sealed === 'true',
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true',
      limit: limit ? Number(limit) : 100,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.statsService.getStats();
  }
}