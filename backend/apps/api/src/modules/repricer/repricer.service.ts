import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { CompsService } from '../comps/comps.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { SmartPricingService } from '../strategy/smart-pricing.service';

@Injectable()
export class RepricerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smartPricing: SmartPricingService,
    private readonly compsService: CompsService,
    private readonly activity: ActivityService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async analyze(params: {
    inventoryItemId: string;
    marketFloor?: number | null;
    marketAverage?: number | null;
    marketCeiling?: number | null;
    targetRoiPercent?: number | null;
  }): Promise<unknown> {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
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

    const costBasis = toMoney(inventoryItem.totalCost);
    const targetRoiPercent = params.targetRoiPercent ?? 35;

    const marketFloor = toMoney(
      params.marketFloor ??
        snapshot?.lowestPriceWithShipping ??
        costBasis * (1 + targetRoiPercent / 100) * 0.9,
    );

    const marketAverage = toMoney(
      params.marketAverage ??
        snapshot?.medianPrice ??
        inventoryItem.expectedSalePriceManual ??
        costBasis * (1 + targetRoiPercent / 100),
    );

    const marketCeiling = toMoney(
      params.marketCeiling ?? Math.max(marketAverage * 1.15, marketFloor),
    );

    const result = this.smartPricing.suggest({
      costBasis,
      lowestMarketPrice: marketFloor,
      medianMarketPrice: marketAverage,
      soldCount: 0,
      volatility: 0.25,
      strategy:
        targetRoiPercent >= 40
          ? 'premium_hold'
          : targetRoiPercent >= 25
            ? 'fast_flip'
            : 'slow_hold',
    });

    const profit = calculateProfit({
      revenue: result.suggestedPrice,
      cost: costBasis,
    });

    const roiPercent = calculateRoiPercent({
      profit,
      cost: costBasis,
    });

    return {
      inventoryItemId: inventoryItem.id,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
      costBasis,
      marketFloor,
      marketAverage,
      marketCeiling,
      targetRoiPercent,
      currentManualPrice: inventoryItem.expectedSalePriceManual,
      suggestedPrice: result.suggestedPrice,
      floorPrice: result.floorPrice,
      stretchPrice: result.stretchPrice,
      classification: result.classification,
      reason: result.reason,
      profit,
      roiPercent,
    };
  }

  async analyzeFromComps(params: {
    inventoryItemId: string;
    targetRoiPercent?: number | null;
  }): Promise<unknown> {
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
      include: {
        item: true,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const summary = (await this.compsService.summary({
      itemId: inventoryItem.itemId,
      setNumber: inventoryItem.item?.setNumber ?? undefined,
      title: inventoryItem.titleSnapshot,
    })) as any;

    const costBasis = toMoney(inventoryItem.totalCost);
    const targetRoiPercent = params.targetRoiPercent ?? 40;

    const marketFloor = toMoney(summary.min ?? costBasis * 1.2);
    const marketAverage = toMoney(summary.median ?? summary.avg ?? costBasis * 1.4);
    const marketCeiling = toMoney(summary.max ?? marketAverage * 1.15);

    const result = this.smartPricing.suggest({
      costBasis,
      lowestMarketPrice: marketFloor,
      medianMarketPrice: marketAverage,
      soldCount: summary.count ?? 0,
      volatility: summary.count >= 3 ? 0.2 : 0.38,
      strategy:
        summary.count >= 5
          ? 'fast_flip'
          : targetRoiPercent >= 45
            ? 'premium_hold'
            : 'slow_hold',
    });

    const profit = calculateProfit({
      revenue: result.suggestedPrice,
      cost: costBasis,
    });

    const roiPercent = calculateRoiPercent({
      profit,
      cost: costBasis,
    });

    return {
      inventoryItemId: inventoryItem.id,
      itemId: inventoryItem.itemId,
      title: inventoryItem.titleSnapshot,
      soldCompCount: summary.count,
      marketFloor,
      marketAverage,
      marketCeiling,
      suggestedPrice: result.suggestedPrice,
      floorPrice: result.floorPrice,
      stretchPrice: result.stretchPrice,
      classification: result.classification,
      reason: result.reason,
      profit,
      roiPercent,
      comps: summary.comps,
    };
  }

  async apply(params: {
    inventoryItemId: string;
    suggestedPrice: number;
  }): Promise<unknown> {
    if (!Number.isFinite(params.suggestedPrice) || params.suggestedPrice <= 0) {
      throw new BadRequestException('suggestedPrice must be positive');
    }

    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: {
        id: params.inventoryItemId,
      },
    });

    if (!inventoryItem) {
      throw new NotFoundException('Inventory item not found');
    }

    const updated = await this.prisma.inventoryItem.update({
      where: {
        id: params.inventoryItemId,
      },
      data: {
        expectedSalePriceManual: toMoney(params.suggestedPrice),
      },
      include: {
        item: true,
        assignedUser: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
    });

    await this.activity.log('repricer.applied', {
      inventoryItemId: updated.id,
      itemId: updated.itemId,
      title: updated.titleSnapshot,
      suggestedPrice: updated.expectedSalePriceManual,
    });

    this.realtime.emitInventoryUpdated(updated);
    this.realtime.emitDashboardRefresh('repricer_applied');
    this.realtime.emitOpportunityRefresh('repricer_applied');

    return updated;
  }
}