import { Injectable } from '@nestjs/common';
import {
  calculateProfit,
  calculateRoiPercent,
  toMoney,
} from '../../common/money.utils';
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
    const [sales, inventory] = await Promise.all([
      this.prisma.sale.findMany({
        include: {
          inventoryItem: true,
        },
      }),
      this.prisma.inventoryItem.findMany(),
    ]);

    const totalRevenue = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0),
    );

    const totalProfit = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
    );

    const inventoryCostBasis = toMoney(
      inventory.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0),
    );

    const expectedInventoryRevenue = toMoney(
      inventory.reduce(
        (sum, item) =>
          sum +
          Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
            Number(item.quantity ?? 1),
        0,
      ),
    );

    const expectedInventoryProfit = calculateProfit({
      revenue: expectedInventoryRevenue,
      cost: inventoryCostBasis,
    });

    return {
      salesCount: sales.length,
      totalRevenue,
      totalProfit,
      avgProfitPerSale:
        sales.length > 0 ? toMoney(totalProfit / sales.length) : 0,
      realizedRoiPercent: calculateRoiPercent({
        profit: totalProfit,
        cost: Math.max(1, totalRevenue - totalProfit),
      }),
      inventoryCostBasis,
      expectedInventoryRevenue,
      expectedInventoryProfit,
      expectedInventoryRoiPercent: calculateRoiPercent({
        profit: expectedInventoryProfit,
        cost: inventoryCostBasis,
      }),
    };
  }

  async getTimeline(limit = 60): Promise<unknown[]> {
    const sales = await this.prisma.sale.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      include: {
        inventoryItem: {
          include: {
            item: true,
          },
        },
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
      include: {
        item: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return inventory.map((item) => {
      const expectedRevenue =
        Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
        Number(item.quantity ?? 1);

      const expectedProfit = calculateProfit({
        revenue: expectedRevenue,
        cost: item.totalCost,
      });

      return {
        id: item.id,
        itemId: item.itemId,
        setNumber: item.item?.setNumber ?? null,
        title: item.titleSnapshot,
        quantity: item.quantity,
        totalCost: item.totalCost,
        expectedRevenue: toMoney(expectedRevenue),
        expectedProfit,
        expectedRoiPercent: calculateRoiPercent({
          profit: expectedProfit,
          cost: item.totalCost,
        }),
      };
    });
  }
}