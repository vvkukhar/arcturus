import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitEconomicsService {
  constructor(private readonly prisma: PrismaService) {}

  async perItem(itemId: string): Promise<unknown> {
    const [item, inventory, sales, expenses, returns] = await Promise.all([
      this.prisma.item.findUnique({
        where: {
          id: itemId,
        },
      }),
      this.prisma.inventoryItem.findMany({
        where: {
          itemId,
        },
      }),
      this.prisma.sale.findMany({
        where: {
          itemId,
        },
      }),
      this.prisma.expense.findMany({
        where: {
          OR: [
            {
              inventoryItem: {
                itemId,
              },
            },
            {
              sale: {
                itemId,
              },
            },
          ],
        },
      }),
      this.prisma.returnRequest.findMany({
        where: {
          sale: {
            itemId,
          },
        },
      }),
    ]);

    const totalUnitsInStock = inventory.reduce((sum, row) => sum + row.quantity, 0);

    const inventoryCost = toMoney(
      inventory.reduce((sum, row) => sum + Number(row.totalCost ?? 0), 0),
    );

    const revenue = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0),
    );

    const cogs = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.costBasis ?? 0), 0),
    );

    const grossProfit = toMoney(revenue - cogs);

    const refunds = toMoney(
      returns
        .filter((row) => ['approved', 'resolved'].includes(row.status))
        .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
    );

    const operatingExpenses = toMoney(
      expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
    );

    const netProfit = toMoney(grossProfit - refunds - operatingExpenses);

    const unitsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);

    const totalUnits = totalUnitsInStock + unitsSold;

    const avgCostPerUnit = totalUnits > 0 ? toMoney((inventoryCost + cogs) / totalUnits) : 0;

    const avgSellPrice = unitsSold > 0 ? toMoney(revenue / unitsSold) : 0;

    return {
      itemId,
      title: item?.title ?? null,
      setNumber: item?.setNumber ?? null,
      theme: item?.theme ?? null,
      totalUnits,
      totalUnitsInStock,
      unitsSold,
      inventoryCost,
      revenue,
      cogs,
      grossProfit,
      refunds,
      operatingExpenses,
      netProfit,
      avgCostPerUnit,
      avgSellPrice,
      roiPercent: cogs > 0 ? toMoney((netProfit / cogs) * 100) : 0,
      marginPercent: revenue > 0 ? toMoney((netProfit / revenue) * 100) : 0,
    };
  }

  async bestItems(): Promise<unknown[]> {
    const items = await this.prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 300,
    });

    const results = [];

    for (const item of items) {
      const economics = (await this.perItem(item.id)) as any;

      results.push({
        itemId: item.id,
        title: item.title,
        setNumber: item.setNumber,
        theme: item.theme,
        netProfit: economics.netProfit,
        roiPercent: economics.roiPercent,
        marginPercent: economics.marginPercent,
        revenue: economics.revenue,
        unitsSold: economics.unitsSold,
      });
    }

    return results
      .filter((row) => row.revenue > 0 || row.netProfit !== 0)
      .sort((a, b) => b.netProfit - a.netProfit)
      .slice(0, 20);
  }

  async worstItems(): Promise<unknown[]> {
    const items = await this.prisma.item.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 300,
    });

    const results = [];

    for (const item of items) {
      const economics = (await this.perItem(item.id)) as any;

      results.push({
        itemId: item.id,
        title: item.title,
        setNumber: item.setNumber,
        theme: item.theme,
        netProfit: economics.netProfit,
        roiPercent: economics.roiPercent,
        marginPercent: economics.marginPercent,
        revenue: economics.revenue,
        unitsSold: economics.unitsSold,
      });
    }

    return results
      .filter((row) => row.revenue > 0 || row.netProfit !== 0)
      .sort((a, b) => a.netProfit - b.netProfit)
      .slice(0, 20);
  }

  async inventoryRisk(): Promise<unknown[]> {
    const inventory = await this.prisma.inventoryItem.findMany({
      include: {
        item: true,
        expenses: true,
        sales: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 300,
    });

    return inventory
      .map((row) => {
        const expectedValue = toMoney(
          Number(row.expectedSalePriceManual ?? row.totalCost ?? 0) *
            Math.max(row.quantity, 1),
        );

        const expenses = toMoney(
          row.expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
        );

        const expectedProfit = toMoney(expectedValue - Number(row.totalCost ?? 0) - expenses);

        const roiPercent =
          row.totalCost > 0 ? toMoney((expectedProfit / Number(row.totalCost)) * 100) : 0;

        let risk = 'low';

        if (row.quantity <= 0) {
          risk = 'sold';
        } else if (expectedProfit < 0) {
          risk = 'high';
        } else if (roiPercent < 15) {
          risk = 'medium';
        }

        return {
          inventoryItemId: row.id,
          itemId: row.itemId,
          title: row.titleSnapshot,
          theme: row.item.theme,
          quantity: row.quantity,
          totalCost: row.totalCost,
          expectedValue,
          expenses,
          expectedProfit,
          roiPercent,
          risk,
        };
      })
      .sort((a, b) => a.expectedProfit - b.expectedProfit);
  }
}