import { Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SyncOrchestratorService } from './sync-orchestrator.service';
import { SyncStateService } from './sync-state.service';
import { SyncService } from './sync.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('sync')
export class SyncController {
  constructor(
    private readonly syncService: SyncService,
    private readonly syncStateService: SyncStateService,
    private readonly syncOrchestratorService: SyncOrchestratorService,
  ) {}

  @Get('item/:itemId/status')
  async getItemSyncStatus(@Param('itemId') itemId: string): Promise<unknown> {
    return this.syncService.getItemSyncStatus(itemId);
  }

  @Get('dashboard/summary')
  async getDashboardSyncSummary(): Promise<unknown> {
    return this.syncService.getDashboardSyncSummary();
  }

  @Get('critical')
  async getCriticalSyncItems(@Query('limit') limit?: string): Promise<unknown[]> {
    return this.syncService.getCriticalSyncItems(limit ? Number(limit) : 50);
  }

  @Get('state')
  getSyncState(): unknown {
    return this.syncStateService.getState();
  }

  @Post('state/reset')
  resetSyncState(): unknown {
    this.syncStateService.reset();
    return this.syncStateService.getState();
  }

  @Post('refresh-all')
  async refreshAll(): Promise<unknown> {
    return this.syncOrchestratorService.refreshAll();
  }

  @Post('item/:itemId/refresh')
  async refreshOneItem(@Param('itemId') itemId: string): Promise<unknown> {
    return this.syncOrchestratorService.refreshOneItem(itemId);
  }
}