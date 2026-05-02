import { Injectable } from '@nestjs/common';
import { DecisionsService } from '../decisions/decisions.service';
import { MarketSyncService } from '../market/market-sync.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { SyncStateService } from './sync-state.service';

@Injectable()
export class SyncOrchestratorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly marketSyncService: MarketSyncService,
    private readonly decisionsService: DecisionsService,
    private readonly syncStateService: SyncStateService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async refreshAll(): Promise<{
    totalItems: number;
    refreshedItems: number;
    recomputedInventoryDecisions: number;
    recomputedWatchlistDecisions: number;
  }> {
    const [items, inventoryItems, watchlistItems] = await Promise.all([
      this.prisma.item.findMany({
        select: {
          id: true,
        },
      }),
      this.prisma.inventoryItem.findMany({
        select: {
          id: true,
        },
      }),
      this.prisma.watchlistItem.findMany({
        select: {
          id: true,
        },
      }),
    ]);

    this.syncStateService.start(
      'global_refresh',
      items.length,
      'Refreshing all market snapshots',
    );

    this.realtime.emitCustom('sync.started', {
      mode: 'global_refresh',
      totalItems: items.length,
    });

    let refreshedItems = 0;
    let recomputedInventoryDecisions = 0;
    let recomputedWatchlistDecisions = 0;

    try {
      for (const item of items) {
        await this.marketSyncService.refreshItemSnapshot(item.id);
        refreshedItems += 1;

        this.syncStateService.progress(
          refreshedItems,
          `Refreshed ${refreshedItems}/${items.length}`,
        );

        if (refreshedItems % 10 === 0 || refreshedItems === items.length) {
          this.realtime.emitCustom('sync.progress', {
            processedItems: refreshedItems,
            totalItems: items.length,
          });
        }
      }

      for (const inventoryItem of inventoryItems) {
        await this.decisionsService.recomputeInventoryDecision(inventoryItem.id);
        recomputedInventoryDecisions += 1;
      }

      for (const watchlistItem of watchlistItems) {
        await this.decisionsService.recomputeWatchlistDecision(watchlistItem.id);
        recomputedWatchlistDecisions += 1;
      }

      this.syncStateService.finish('Global refresh completed');

      this.realtime.emitCustom('sync.finished', {
        refreshedItems,
        recomputedInventoryDecisions,
        recomputedWatchlistDecisions,
      });

      this.realtime.emitDashboardRefresh('sync_refresh_all');
      this.realtime.emitOpportunityRefresh('sync_refresh_all');

      return {
        totalItems: items.length,
        refreshedItems,
        recomputedInventoryDecisions,
        recomputedWatchlistDecisions,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.syncStateService.fail(message);

      this.realtime.emitCustom('sync.failed', {
        message,
      });

      throw error;
    }
  }

  async refreshOneItem(itemId: string): Promise<unknown> {
    this.syncStateService.start('item_refresh', 1, 'Refreshing item');

    try {
      const snapshot = await this.marketSyncService.refreshItemSnapshot(itemId);

      const inventoryItems = await this.prisma.inventoryItem.findMany({
        where: {
          itemId,
        },
        select: {
          id: true,
        },
      });

      const watchlistItems = await this.prisma.watchlistItem.findMany({
        where: {
          itemId,
        },
        select: {
          id: true,
        },
      });

      for (const inventoryItem of inventoryItems) {
        await this.decisionsService.recomputeInventoryDecision(inventoryItem.id);
      }

      for (const watchlistItem of watchlistItems) {
        await this.decisionsService.recomputeWatchlistDecision(watchlistItem.id);
      }

      this.syncStateService.progress(1, 'Item refreshed');
      this.syncStateService.finish('Item refresh completed');

      this.realtime.emitItemRefresh(itemId, 'manual_item_refresh');
      this.realtime.emitDashboardRefresh('manual_item_refresh');
      this.realtime.emitOpportunityRefresh('manual_item_refresh');

      return {
        itemId,
        snapshot,
        inventoryDecisions: inventoryItems.length,
        watchlistDecisions: watchlistItems.length,
      };
    } catch (error) {
      this.syncStateService.fail(error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}