import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class DecisionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async recomputeInventoryDecision(inventoryItemId: string): Promise<unknown> {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: inventoryItemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: {
        itemId: inventoryItem.itemId,
      },
      orderBy: {
        computedAt: 'desc',
      },
    });

    const marketMedian =
      snapshot?.medianPrice ?? inventoryItem.expectedSalePriceManual ?? 0;
    const marketLowest = snapshot?.lowestPriceWithShipping ?? marketMedian;
    const totalCost = inventoryItem.totalCost;
    const expectedManual = inventoryItem.expectedSalePriceManual ?? marketMedian;
    const margin = expectedManual - totalCost;

    let action = 'review';
    let score = 50;
    const confidence = snapshot?.confidenceScore ?? 0.4;
    let reasonPrimary = 'Needs manual review';
    let reasonSecondary = 'No strong rule fired';

    if (margin >= 300 && marketLowest >= totalCost * 1.3) {
      action = 'sell';
      score = 82;
      reasonPrimary = 'Healthy margin available';
      reasonSecondary = 'Market supports sale';
    } else if (marketMedian > expectedManual + 100) {
      action = 'reprice';
      score = 78;
      reasonPrimary = 'Price below market median';
      reasonSecondary = 'Repricing likely improves return';
    } else if (margin >= 120) {
      action = 'hold';
      score = 63;
      reasonPrimary = 'Position is acceptable';
      reasonSecondary = 'No urgent action needed';
    } else if (margin <= 50) {
      action = 'review';
      score = 88;
      reasonPrimary = 'Weak margin';
      reasonSecondary = 'Manual intervention recommended';
    }

    const decision = await this.prisma.decisionSnapshot.create({
      data: {
        itemId: inventoryItem.itemId,
        contextType: 'inventory',
        contextId: inventoryItem.id,
        action,
        score,
        confidence,
        reasonPrimary,
        reasonSecondary,
        payloadJson: {
          totalCost,
          marketMedian,
          marketLowest,
          expectedManual,
          margin,
        },
      },
    });

    this.realtime.emitItemRefresh(inventoryItem.itemId, 'inventory_decision_recomputed');
    this.realtime.emitDashboardRefresh('inventory_decision_recomputed');
    this.realtime.emitOpportunityRefresh('inventory');

    return decision;
  }

  async recomputeWatchlistDecision(watchlistItemId: string): Promise<unknown> {
    const watchlistItem = await this.prisma.watchlistItem.findUnique({
      where: {
        id: watchlistItemId,
      },
      include: {
        item: true,
      },
    });

    if (!watchlistItem) {
      throw new NotFoundException('Watchlist item not found');
    }

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: {
        itemId: watchlistItem.itemId,
      },
      orderBy: {
        computedAt: 'desc',
      },
    });

    const lowestWithShipping =
      snapshot?.lowestPriceWithShipping ?? watchlistItem.maxBuyPrice;
    const targetSell = watchlistItem.targetSellPrice ?? 0;
    const spread = targetSell - lowestWithShipping;

    let action = 'wait';
    let score = 45;
    const confidence = snapshot?.confidenceScore ?? 0.4;
    let reasonPrimary = 'Wait for better entry';
    let reasonSecondary = 'Price is not strong enough';

    if (lowestWithShipping <= watchlistItem.maxBuyPrice && spread >= 250) {
      action = 'buy';
      score = 86;
      reasonPrimary = 'Inside max buy zone';
      reasonSecondary = 'Spread supports entry';
    } else if (lowestWithShipping <= watchlistItem.maxBuyPrice && spread >= 120) {
      action = 'buy';
      score = 72;
      reasonPrimary = 'Acceptable buy zone';
      reasonSecondary = 'Spread is workable';
    }

    const decision = await this.prisma.decisionSnapshot.create({
      data: {
        itemId: watchlistItem.itemId,
        contextType: 'watchlist',
        contextId: watchlistItem.id,
        action,
        score,
        confidence,
        reasonPrimary,
        reasonSecondary,
        payloadJson: {
          maxBuyPrice: watchlistItem.maxBuyPrice,
          desiredBuyPrice: watchlistItem.desiredBuyPrice,
          targetSell,
          lowestWithShipping,
          spread,
        },
      },
    });

    this.realtime.emitItemRefresh(watchlistItem.itemId, 'watchlist_decision_recomputed');
    this.realtime.emitDashboardRefresh('watchlist_decision_recomputed');
    this.realtime.emitOpportunityRefresh('watchlist');

    return decision;
  }

  async getLatestInventoryDecision(inventoryItemId: string): Promise<unknown> {
    return this.prisma.decisionSnapshot.findFirst({
      where: {
        contextType: 'inventory',
        contextId: inventoryItemId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getLatestWatchlistDecision(watchlistItemId: string): Promise<unknown> {
    return this.prisma.decisionSnapshot.findFirst({
      where: {
        contextType: 'watchlist',
        contextId: watchlistItemId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}