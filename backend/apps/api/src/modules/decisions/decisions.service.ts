import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { toCents, fromCents } from '@arcturus/shared';

@Injectable()
export class DecisionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async recomputeInventoryDecision(inventoryItemId: string): Promise<unknown> {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { item: true },
    });

    if (!inventoryItem) throw new NotFoundException('Inventory item not found');

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: { itemId: inventoryItem.itemId },
      orderBy: { computedAt: 'desc' },
    });

    const marketMedianCents = toCents(snapshot?.medianPrice ?? inventoryItem.expectedSalePriceManual ?? 0);
    const marketLowestCents = toCents(snapshot?.lowestPriceWithShipping ?? (snapshot?.medianPrice ?? 0));
    const totalCostCents = toCents(Number(inventoryItem.totalCost));
    const expectedManualCents = toCents(inventoryItem.expectedSalePriceManual ?? fromCents(marketMedianCents));
    const marginCents = expectedManualCents - totalCostCents;

    let action = 'review';
    let score = 50;
    const confidence = snapshot?.confidenceScore ?? 0.4;
    let reasonPrimary = 'Needs manual review';
    let reasonSecondary = 'No strong rule fired';

    if (marginCents >= 30000 && marketLowestCents >= totalCostCents * 1.3) {
      action = 'sell';
      score = 82;
      reasonPrimary = 'Healthy margin available';
      reasonSecondary = 'Market supports sale';
    } else if (marketMedianCents > expectedManualCents + 10000) {
      action = 'reprice';
      score = 78;
      reasonPrimary = 'Price below market median';
      reasonSecondary = 'Repricing likely improves return';
    } else if (marginCents >= 12000) {
      action = 'hold';
      score = 63;
      reasonPrimary = 'Position is acceptable';
      reasonSecondary = 'No urgent action needed';
    } else if (marginCents <= 5000) {
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
          totalCost: fromCents(totalCostCents),
          marketMedian: fromCents(marketMedianCents),
          marketLowest: fromCents(marketLowestCents),
          expectedManual: fromCents(expectedManualCents),
          margin: fromCents(marginCents),
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
      where: { id: watchlistItemId },
      include: { item: true },
    });

    if (!watchlistItem) throw new NotFoundException('Watchlist item not found');

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: { itemId: watchlistItem.itemId },
      orderBy: { computedAt: 'desc' },
    });

    const lowestWithShippingCents = toCents(snapshot?.lowestPriceWithShipping ?? Number(watchlistItem.maxBuyPrice));
    const targetSellCents = toCents(Number(watchlistItem.targetSellPrice ?? 0));
    const maxBuyPriceCents = toCents(Number(watchlistItem.maxBuyPrice));
    const spreadCents = targetSellCents - lowestWithShippingCents;

    let action = 'wait';
    let score = 45;
    const confidence = snapshot?.confidenceScore ?? 0.4;
    let reasonPrimary = 'Wait for better entry';
    let reasonSecondary = 'Price is not strong enough';

    if (lowestWithShippingCents <= maxBuyPriceCents && spreadCents >= 25000) {
      action = 'buy';
      score = 86;
      reasonPrimary = 'Inside max buy zone';
      reasonSecondary = 'Spread supports entry';
    } else if (lowestWithShippingCents <= maxBuyPriceCents && spreadCents >= 12000) {
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
          maxBuyPrice: fromCents(maxBuyPriceCents),
          desiredBuyPrice: watchlistItem.desiredBuyPrice,
          targetSell: fromCents(targetSellCents),
          lowestWithShipping: fromCents(lowestWithShippingCents),
          spread: fromCents(spreadCents),
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
      where: { contextType: 'inventory', contextId: inventoryItemId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getLatestWatchlistDecision(watchlistItemId: string): Promise<unknown> {
    return this.prisma.decisionSnapshot.findFirst({
      where: { contextType: 'watchlist', contextId: watchlistItemId },
      orderBy: { createdAt: 'desc' },
    });
  }
}