import { Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UnitEconomicsService {
  constructor(private readonly prisma: PrismaService) {}

  async perItem(itemId: string): Promise<unknown> {
    const [item, inventoryAgg, salesAgg, expensesAgg, returnsAgg] = await Promise.all([
      this.prisma.item.findUnique({
        where: { id: itemId },
      }),
      this.prisma.inventoryItem.aggregate({
        where: { itemId },
        _sum: { quantity: true, totalCost: true },
      }),
      this.prisma.sale.aggregate({
        where: { itemId },
        _sum: { quantity: true, sellPrice: true, costBasis: true, profit: true },
      }),
      this.prisma.expense.aggregate({
        where: {
          OR: [{ inventoryItem: { itemId } }, { sale: { itemId } }],
        },
        _sum: { amount: true },
      }),
      this.prisma.returnRequest.aggregate({
        where: {
          sale: { itemId },
          status: { in: ['approved', 'resolved'] },
        },
        _sum: { refundAmount: true },
      }),
    ]);

    const totalUnitsInStock = inventoryAgg._sum.quantity ?? 0;
    const inventoryCost = toMoney(inventoryAgg._sum.totalCost ?? 0);
    const revenue = toMoney(salesAgg._sum.sellPrice ?? 0);
    const cogs = toMoney(salesAgg._sum.costBasis ?? 0);
    const grossProfit = toMoney(salesAgg._sum.profit ?? 0);
    const refunds = toMoney(returnsAgg._sum.refundAmount ?? 0);
    const operatingExpenses = toMoney(expensesAgg._sum.amount ?? 0);

    const netProfit = toMoney(grossProfit - refunds - operatingExpenses);
    const unitsSold = salesAgg._sum.quantity ?? 0;
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
    const salesGroup = await this.prisma.sale.groupBy({
      by: ['itemId'],
      _sum: { profit: true, sellPrice: true, quantity: true },
      orderBy: { _sum: { profit: 'desc' } },
      take: 20,
    });

    const resultsRaw = await Promise.all(
      salesGroup.map((group) => this.perItem(group.itemId))
    );

    const results = resultsRaw
      .map((eco: any) => ({
        itemId: eco.itemId,
        title: eco.title,
        setNumber: eco.setNumber,
        theme: eco.theme,
        netProfit: eco.netProfit,
        roiPercent: eco.roiPercent,
        marginPercent: eco.marginPercent,
        revenue: eco.revenue,
        unitsSold: eco.unitsSold,
      }))
      .filter((eco) => eco.revenue > 0 || eco.netProfit !== 0);

    return results.sort((a, b) => b.netProfit - a.netProfit);
  }

  async worstItems(): Promise<unknown[]> {
    const salesGroup = await this.prisma.sale.groupBy({
      by: ['itemId'],
      _sum: { profit: true, sellPrice: true, quantity: true },
      orderBy: { _sum: { profit: 'asc' } },
      take: 20,
    });

    const resultsRaw = await Promise.all(
      salesGroup.map((group) => this.perItem(group.itemId))
    );

    const results = resultsRaw
      .map((eco: any) => ({
        itemId: eco.itemId,
        title: eco.title,
        setNumber: eco.setNumber,
        theme: eco.theme,
        netProfit: eco.netProfit,
        roiPercent: eco.roiPercent,
        marginPercent: eco.marginPercent,
        revenue: eco.revenue,
        unitsSold: eco.unitsSold,
      }))
      .filter((eco) => eco.revenue > 0 || eco.netProfit !== 0);

    return results.sort((a, b) => a.netProfit - b.netProfit);
  }

  async inventoryRisk(): Promise<unknown[]> {
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      include: { item: true },
      orderBy: { totalCost: 'desc' },
      take: 100,
    });

    const expensesAggs = await Promise.all(
      inventory.map((row) =>
        this.prisma.expense.aggregate({
          where: { inventoryItemId: row.id },
          _sum: { amount: true },
        })
      )
    );

    const results = inventory.map((row, index) => {
      const expenses = toMoney(expensesAggs[index]._sum.amount ?? 0);
      const expectedValue = toMoney(Number(row.expectedSalePriceManual ?? row.totalCost ?? 0) * row.quantity);
      const expectedProfit = toMoney(expectedValue - Number(row.totalCost ?? 0) - expenses);
      const roiPercent = row.totalCost > 0 ? toMoney((expectedProfit / Number(row.totalCost)) * 100) : 0;

      let risk = 'low';
      if (row.quantity <= 0) risk = 'sold';
      else if (expectedProfit < 0) risk = 'high';
      else if (roiPercent < 15) risk = 'medium';

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
    });

    return results.sort((a, b) => a.expectedProfit - b.expectedProfit).slice(0, 50);
  }
}