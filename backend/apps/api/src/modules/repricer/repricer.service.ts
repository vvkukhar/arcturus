import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

interface RepriceResult {
  inventoryItemId: string;
  currentPrice: number;
  suggestedPrice: number;
  roiPercent: number;
  marketFloor: number;
  marketCeiling: number;
}

@Injectable()
export class RepricerService {
  private readonly logger = new Logger(RepricerService.name);

  constructor(private readonly prisma: PrismaService) {}

  async analyzeItem(inventoryItemId: string, targetRoi: number = 40): Promise<RepriceResult> {
    const inventory = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { item: true },
    });

    if (!inventory) {
      throw new Error('Inventory item not found');
    }

    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: { itemId: inventory.itemId },
      orderBy: { computedAt: 'desc' },
    });

    const costBasis = Number(inventory.totalCost);
    if (costBasis <= 0) {
      throw new Error('Invalid cost basis');
    }

    let floor = snapshot?.lowestPrice ? Number(snapshot.lowestPrice) : costBasis * 1.2;
    let avg = snapshot?.avgPrice ? Number(snapshot.avgPrice) : costBasis * 1.5;
    let ceiling = snapshot?.medianPrice ? Number(snapshot.medianPrice) * 1.3 : costBasis * 2.0;

    if (inventory.sealed) {
      floor *= 1.15;
      avg *= 1.15;
      ceiling *= 1.15;
    }

    const absoluteMinPrice = costBasis * (1 + (targetRoi / 100));
    
    let suggestedPrice = avg;

    if (avg < absoluteMinPrice) {
      suggestedPrice = Math.max(absoluteMinPrice, floor);
    } else {
      suggestedPrice = Math.min(avg, ceiling);
    }

    suggestedPrice = Math.ceil(suggestedPrice / 10) * 10 - 1;

    const projectedRoi = ((suggestedPrice - costBasis) / costBasis) * 100;

    return {
      inventoryItemId: inventory.id,
      currentPrice: inventory.expectedSalePriceManual ? Number(inventory.expectedSalePriceManual) : 0,
      suggestedPrice,
      roiPercent: projectedRoi,
      marketFloor: floor,
      marketCeiling: ceiling,
    };
  }

  async applyReprice(inventoryItemId: string, suggestedPrice: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { expectedSalePriceManual: new Prisma.Decimal(suggestedPrice) },
      });

      await tx.repriceFlowItem.updateMany({
        where: { inventoryItemId, status: 'pending' },
        data: { 
          status: 'completed', 
          suggestedPrice: new Prisma.Decimal(suggestedPrice),
          updatedAt: new Date()
        },
      });

      await tx.activityLog.create({
        data: {
          action: 'INVENTORY_REPRICED',
          payloadJson: { inventoryItemId, newPrice: suggestedPrice },
        }
      });
    });
  }

  async processRepriceQueue(): Promise<number> {
    const pendingItems = await this.prisma.repriceFlowItem.findMany({
      where: { status: 'pending' },
      take: 50,
    });

    let processed = 0;

    for (const item of pendingItems) {
      try {
        const analysis = await this.analyzeItem(item.inventoryItemId);
        if (analysis.roiPercent >= 15) { 
          await this.applyReprice(item.inventoryItemId, analysis.suggestedPrice);
          processed++;
        }
      } catch (error) {
        this.logger.error(`Failed to reprice item ${item.inventoryItemId}: ${error.message}`);
      }
    }

    return processed;
  }
}