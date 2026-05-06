import { Injectable } from '@nestjs/common';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfitService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<{
    salesCount: number;
    totalRevenue: number;
    totalProfit: number;
    avgProfitPerSale: number;
    realizedRoiPercent: number;
    inventoryCostBasis: number;
    expectedInventoryRevenue: number;
    expectedInventoryProfit: number;
    expectedInventoryRoiPercent: number;
  }> {
    const [salesAgg, inventoryAgg] = await Promise.all([
      this.prisma.sale.aggregate({
        _count: { _all: true },
        _sum: { sellPrice: true, profit: true }
      }),
      this.prisma.inventoryItem.aggregate({
        _sum: { totalCost: true, expectedSalePriceManual: true, quantity: true }
      }),
    ]);

    const totalRevenue = toMoney(salesAgg._sum.sellPrice ?? 0);
    const totalProfit = toMoney(salesAgg._sum.profit ?? 0);
    const salesCount = salesAgg._count._all;
    
    const inventoryCostBasis = toMoney(inventoryAgg._sum.totalCost ?? 0);
    const expectedInventoryRevenue = toMoney(inventoryAgg._sum.expectedSalePriceManual ?? inventoryAgg._sum.totalCost ?? 0);
    const expectedInventoryProfit = calculateProfit({ revenue: expectedInventoryRevenue, cost: inventoryCostBasis });

    return {
      salesCount,
      totalRevenue,
      totalProfit,
      avgProfitPerSale: salesCount > 0 ? toMoney(totalProfit / salesCount) : 0,
      realizedRoiPercent: calculateRoiPercent({ profit: totalProfit, cost: Math.max(1, totalRevenue - totalProfit) }),
      inventoryCostBasis,
      expectedInventoryRevenue,
      expectedInventoryProfit,
      expectedInventoryRoiPercent: calculateRoiPercent({ profit: expectedInventoryProfit, cost: inventoryCostBasis }),
    };
  }

  async getTimeline(limit = 60): Promise<unknown[]> {
    const sales = await this.prisma.sale.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        createdAt: true,
        sellPrice: true,
        profit: true,
        inventoryItem: {
          select: { titleSnapshot: true, itemId: true, item: { select: { setNumber: true } } }
        }
      },
    });

    return sales.map((sale) => ({
      id: sale.id,
      createdAt: sale.createdAt,
      title: sale.inventoryItem?.titleSnapshot ?? 'Sale',
      sellPrice: sale.sellPrice,
      profit: sale.profit,
      itemId: sale.inventoryItem?.itemId ?? null,
      setNumber: sale.inventoryItem?.item?.setNumber ?? null,
    }));
  }

  async getInventoryPosition(): Promise<unknown[]> {
    const inventory = await this.prisma.inventoryItem.findMany({
      include: { item: true },
      orderBy: { createdAt: 'desc' },
    });

    return inventory.map((item) => {
      const expectedRevenue = Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) * Number(item.quantity ?? 1);
      const expectedProfit = calculateProfit({ revenue: expectedRevenue, cost: item.totalCost });

      return {
        id: item.id,
        itemId: item.itemId,
        setNumber: item.item?.setNumber ?? null,
        title: item.titleSnapshot,
        quantity: item.quantity,
        totalCost: item.totalCost,
        expectedRevenue: toMoney(expectedRevenue),
        expectedProfit,
        expectedRoiPercent: calculateRoiPercent({ profit: expectedProfit, cost: item.totalCost }),
      };
    });
  }
}