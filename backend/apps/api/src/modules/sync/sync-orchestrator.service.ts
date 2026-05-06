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

  private async processInChunks<T>(items: T[], chunkSize: number, processor: (item: T) => Promise<void>) {
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      await Promise.all(chunk.map(processor));
    }
  }

  async refreshAll(): Promise<{
    totalItems: number;
    refreshedItems: number;
    recomputedInventoryDecisions: number;
    recomputedWatchlistDecisions: number;
  }> {
    const totalItems = await this.prisma.item.count();

    this.syncStateService.start('global_refresh', totalItems, 'Refreshing all market snapshots');
    this.realtime.emitCustom('sync.started', { mode: 'global_refresh', totalItems });

    let refreshedItems = 0;
    let recomputedInventoryDecisions = 0;
    let recomputedWatchlistDecisions = 0;

    try {
      let hasMoreItems = true;
      let lastItemId: string | undefined = undefined;

      while (hasMoreItems) {
        const itemsChunk = (await this.prisma.item.findMany({
          select: { id: true },
          take: 500,
          skip: lastItemId ? 1 : undefined,
          cursor: lastItemId ? { id: lastItemId } : undefined,
          orderBy: { id: 'asc' },
        })) as { id: string }[];

        if (itemsChunk.length === 0) {
          hasMoreItems = false;
          break;
        }

        lastItemId = itemsChunk[itemsChunk.length - 1].id;

        await this.processInChunks(itemsChunk, 10, async (item) => {
            await this.marketSyncService.refreshItemSnapshot(item.id);
            refreshedItems += 1;
        });

        this.syncStateService.progress(refreshedItems, `Refreshed ${refreshedItems}/${totalItems}`);
        this.realtime.emitCustom('sync.progress', { processedItems: refreshedItems, totalItems });
      }

      let hasMoreInv = true;
      let lastInvId: string | undefined = undefined;

      while (hasMoreInv) {
        const invChunk = (await this.prisma.inventoryItem.findMany({
          select: { id: true },
          where: { quantity: { gt: 0 } },
          take: 500,
          skip: lastInvId ? 1 : undefined,
          cursor: lastInvId ? { id: lastInvId } : undefined,
          orderBy: { id: 'asc' },
        })) as { id: string }[];

        if (invChunk.length === 0) {
          hasMoreInv = false;
          break;
        }

        lastInvId = invChunk[invChunk.length - 1].id;

        await this.processInChunks(invChunk, 10, async (inventoryItem) => {
            await this.decisionsService.recomputeInventoryDecision(inventoryItem.id);
            recomputedInventoryDecisions += 1;
        });
      }

      let hasMoreWatch = true;
      let lastWatchId: string | undefined = undefined;

      while (hasMoreWatch) {
        const watchChunk = (await this.prisma.watchlistItem.findMany({
          select: { id: true },
          where: { active: true },
          take: 500,
          skip: lastWatchId ? 1 : undefined,
          cursor: lastWatchId ? { id: lastWatchId } : undefined,
          orderBy: { id: 'asc' },
        })) as { id: string }[];

        if (watchChunk.length === 0) {
          hasMoreWatch = false;
          break;
        }

        lastWatchId = watchChunk[watchChunk.length - 1].id;

        await this.processInChunks(watchChunk, 10, async (watchlistItem) => {
            await this.decisionsService.recomputeWatchlistDecision(watchlistItem.id);
            recomputedWatchlistDecisions += 1;
        });
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
        totalItems,
        refreshedItems,
        recomputedInventoryDecisions,
        recomputedWatchlistDecisions,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.syncStateService.fail(message);
      this.realtime.emitCustom('sync.failed', { message });
      throw error;
    }
  }

  async refreshOneItem(itemId: string): Promise<unknown> {
    this.syncStateService.start('item_refresh', 1, 'Refreshing item');

    try {
      const snapshot = await this.marketSyncService.refreshItemSnapshot(itemId);

      const [inventoryItems, watchlistItems] = await Promise.all([
        this.prisma.inventoryItem.findMany({ where: { itemId, quantity: { gt: 0 } }, select: { id: true } }),
        this.prisma.watchlistItem.findMany({ where: { itemId, active: true }, select: { id: true } }),
      ]);

      await Promise.all([
        ...inventoryItems.map((inv: { id: string }) => this.decisionsService.recomputeInventoryDecision(inv.id)),
        ...watchlistItems.map((watch: { id: string }) => this.decisionsService.recomputeWatchlistDecision(watch.id))
      ]);

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