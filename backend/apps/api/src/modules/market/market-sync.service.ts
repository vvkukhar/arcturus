import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MarketSnapshotRecomputeService } from './market-snapshot-recompute.service';

@Injectable()
export class MarketSyncService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly snapshotRecomputeService: MarketSnapshotRecomputeService,
  ) {}

  async refreshItemSnapshot(itemId: string): Promise<unknown> {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return this.snapshotRecomputeService.recomputeForItem(itemId);
  }

  async refreshInventoryItemSnapshot(inventoryItemId: string): Promise<unknown> {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
    });
    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }
    return this.snapshotRecomputeService.recomputeForItem(inventoryItem.itemId);
  }

  async refreshWatchlistItemSnapshot(watchlistItemId: string): Promise<unknown> {
    const watchlistItem = await this.prisma.watchlistItem.findUnique({
      where: { id: watchlistItemId },
    });
    if (!watchlistItem) {
      throw new NotFoundException('Watchlist item not found');
    }
    return this.snapshotRecomputeService.recomputeForItem(watchlistItem.itemId);
  }
}