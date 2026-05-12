import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { UnitEconomicsService } from '../finance/unit-economics.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { EvaluateBuyDto } from './dto/evaluate-buy.dto';
import { EvaluateInventoryDto } from './dto/evaluate-inventory.dto';

interface BuyScoreResult {
  action: string;
  score: number;
  confidence: number;
  reasonPrimary: string;
  reasonSecondary?: string;
  expectedProfit: number;
  roiPercent: number;
}

@Injectable()
export class DecisionEngineService {
  private readonly BUY_MATRIX = [
    { minScore: 85, action: 'BUY_NOW', reason: 'High ROI and strong expected profit' },
    { minScore: 70, action: 'BUY', reason: 'Good expected margin' },
    { minScore: 45, action: 'WATCH', reason: 'Acceptable but not urgent' },
    { minScore: -Infinity, action: 'SKIP', reason: 'Weak economics' }
  ];

  private readonly INV_MATRIX = [
    { minRoiRatio: 1.5, action: 'SELL_FAST', score: 85, reason: 'Strong expected ROI; prioritize listing' },
    { minRoiRatio: 1.0, action: 'HOLD', score: 50, reason: 'Inventory is within normal range' },
    { minRoiRatio: 0.0, action: 'REPRICE_UP', score: 70, reason: 'Expected ROI is below target' },
    { minRoiRatio: -Infinity, action: 'REPRICE_UP_OR_REVIEW', score: 80, reason: 'Expected profit is negative' }
  ];

  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly realtime: RealtimeGateway,
    private readonly unitEconomics: UnitEconomicsService,
  ) {}

  private resolveActionFromMatrix(score: number, matrix: { minScore: number; action: string; reason: string }[]) {
    for (const tier of matrix) {
      if (score >= tier.minScore) return { action: tier.action, reasonPrimary: tier.reason };
    }
    return { action: 'SKIP', reasonPrimary: 'Unknown' };
  }

  private resolveInventoryActionFromMatrix(roiRatio: number, matrix: { minRoiRatio: number; action: string; score: number; reason: string }[]) {
    for (const tier of matrix) {
      if (roiRatio >= tier.minRoiRatio) return { action: tier.action, score: tier.score, reasonPrimary: tier.reason };
    }
    return { action: 'HOLD', score: 50, reasonPrimary: 'Unknown' };
  }

  private scoreBuy(params: {
    buyPrice: number;
    shippingPrice: number;
    targetSellPrice: number;
    historicalRoi: number;
  }): BuyScoreResult {
    const totalCost = toMoney(params.buyPrice + params.shippingPrice);
    const expectedProfit = toMoney(params.targetSellPrice - totalCost);
    const roiPercent = totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

    let score = 50;
    score += Math.min(30, roiPercent / 2);

    if (params.historicalRoi > 30) score += 10;
    if (expectedProfit < 0) score -= 60;
    if (roiPercent < 15) score -= 25;
    if (roiPercent >= 40) score += 15;

    score = Math.max(0, Math.min(100, toMoney(score)));

    let { action, reasonPrimary } = this.resolveActionFromMatrix(score, this.BUY_MATRIX);
    let reasonSecondary: string | undefined;

    if (expectedProfit < 0) {
      action = 'SKIP';
      reasonPrimary = 'Expected profit is negative';
    }

    if (params.historicalRoi < 0) {
      reasonSecondary = 'Historical item ROI is negative';
      score = Math.max(0, score - 10);
    }

    return {
      action,
      score,
      confidence: 0.75,
      reasonPrimary,
      reasonSecondary,
      expectedProfit,
      roiPercent,
    };
  }

  async evaluateBuy(dto: EvaluateBuyDto): Promise<unknown> {
    const item = await this.prisma.item.findUnique({
      where: { id: dto.itemId },
    });

    if (!item) throw new NotFoundException('Item not found');

    let listing = null;
    if (dto.listingId) {
      listing = await this.prisma.marketListing.findUnique({
        where: { id: dto.listingId },
      });
      if (!listing) throw new NotFoundException('Listing not found');
    }

    const economics = (await this.unitEconomics.perItem(dto.itemId)) as any;

    const buyPrice = toMoney(dto.buyPrice ?? listing?.price ?? 0);
    const shippingPrice = toMoney(dto.shippingPrice ?? listing?.shippingPrice ?? 0);
    const fallbackSellPrice = Number(listing?.price ?? 0) * 1.4;

    const targetSellPrice = toMoney(
      dto.targetSellPrice ??
        economics.avgSellPrice ??
        (fallbackSellPrice || buyPrice * 1.4),
    );

    if (buyPrice <= 0) throw new BadRequestException('buyPrice is required');

    const decision = this.scoreBuy({
      buyPrice,
      shippingPrice,
      targetSellPrice,
      historicalRoi: Number(economics.roiPercent ?? 0),
    });

    const snapshot = await this.prisma.decisionSnapshot.create({
      data: {
        itemId: dto.itemId,
        contextType: dto.listingId ? 'listing' : 'manual_buy',
        contextId: dto.listingId ?? dto.itemId,
        action: decision.action,
        score: decision.score,
        confidence: decision.confidence,
        reasonPrimary: decision.reasonPrimary,
        reasonSecondary: decision.reasonSecondary ?? null,
        executionStatus: 'pending',
        payloadJson: {
          buyPrice,
          shippingPrice,
          targetSellPrice,
          expectedProfit: decision.expectedProfit,
          roiPercent: decision.roiPercent,
          historicalRoi: economics.roiPercent,
        },
      },
    });

    await this.activity.log('decision.buy_evaluated', {
      decisionSnapshotId: snapshot.id,
      itemId: dto.itemId,
      action: decision.action,
      score: decision.score,
    });

    this.realtime.emitCustom('decision.buy_evaluated', snapshot);
    this.realtime.emitDashboardRefresh('decision_buy_evaluated');

    return snapshot;
  }

  async evaluateInventory(dto: EvaluateInventoryDto): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.inventoryItemId },
      include: { item: true, expenses: true },
    });

    if (!inventory) throw new NotFoundException('Inventory item not found');

    const targetRoiPercent = dto.targetRoiPercent ?? 35;
    const expenses = toMoney(
      inventory.expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
    );

    const totalCost = toMoney(Number(inventory.totalCost ?? 0) + expenses);
    const currentExpected = toMoney(
      Number(inventory.expectedSalePriceManual ?? inventory.totalCost ?? 0),
    );

    const targetPrice = toMoney(totalCost * (1 + targetRoiPercent / 100));
    const expectedProfit = toMoney(currentExpected - totalCost);
    const roiPercent = totalCost > 0 ? toMoney((expectedProfit / totalCost) * 100) : 0;

    let action = 'HOLD';
    let score = 50;
    let reasonPrimary = 'Inventory is within normal range';

    if (inventory.quantity <= 0) {
      action = 'SOLD_OUT';
      score = 100;
      reasonPrimary = 'No stock remaining';
    } else {
      const roiRatio = targetRoiPercent > 0 ? roiPercent / targetRoiPercent : 0;
      const matrixResult = this.resolveInventoryActionFromMatrix(roiRatio, this.INV_MATRIX);
      action = matrixResult.action;
      score = matrixResult.score;
      reasonPrimary = matrixResult.reasonPrimary;
    }

    const snapshot = await this.prisma.decisionSnapshot.create({
      data: {
        itemId: inventory.itemId,
        contextType: 'inventory',
        contextId: inventory.id,
        action,
        score,
        confidence: 0.8,
        reasonPrimary,
        reasonSecondary: null,
        executionStatus: 'pending',
        payloadJson: {
          inventoryItemId: inventory.id,
          totalCost,
          expenses,
          currentExpected,
          targetPrice,
          expectedProfit,
          roiPercent,
          targetRoiPercent,
        },
      },
    });

    await this.activity.log('decision.inventory_evaluated', {
      decisionSnapshotId: snapshot.id,
      inventoryItemId: inventory.id,
      action,
      score,
    });

    this.realtime.emitCustom('decision.inventory_evaluated', snapshot);
    this.realtime.emitDashboardRefresh('decision_inventory_evaluated');

    return snapshot;
  }

  async latest(params?: {
    contextType?: string;
    action?: string;
    executionStatus?: string;
    limit?: number;
  }): Promise<unknown[]> {
    return this.prisma.decisionSnapshot.findMany({
      where: {
        ...(params?.contextType ? { contextType: params.contextType } : {}),
        ...(params?.action ? { action: params.action } : {}),
        ...(params?.executionStatus ? { executionStatus: params.executionStatus } : {}),
      },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
      take: params?.limit ?? 100,
    });
  }

  private async processInChunks<T>(items: T[], chunkSize: number, processor: (item: T) => Promise<any>) {
    const results = [];
    for (let i = 0; i < items.length; i += chunkSize) {
      const chunk = items.slice(i, i + chunkSize);
      const chunkResults = await Promise.all(chunk.map(processor));
      results.push(...chunkResults);
    }
    return results;
  }

  async runInventorySweep(): Promise<unknown> {
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      take: 200,
    });

    const results = await this.processInChunks(inventory, 10, (row) =>
      this.evaluateInventory({ inventoryItemId: row.id })
    );

    return { evaluated: results.length, results };
  }

  async runBuySweep(): Promise<unknown> {
    const listings = await this.prisma.marketListing.findMany({
      where: { status: 'active' },
      orderBy: { fetchedAt: 'desc' },
      take: 200,
    });

    const results = await this.processInChunks(listings, 10, (listing) =>
      this.evaluateBuy({
        itemId: listing.itemId,
        listingId: listing.id,
      })
    );

    return { evaluated: results.length, results };
  }
}