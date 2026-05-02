import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AllocationService {
  constructor(private readonly prisma: PrismaService) {}

  async getCapitalAllocation(): Promise<unknown> {
    const [inventory, sales, returns, expenses, watchlist, purchaseOrders] =
      await Promise.all([
        this.prisma.inventoryItem.findMany({
          include: {
            item: true,
            location: {
              include: {
                warehouse: true,
              },
            },
          },
        }),
        this.prisma.sale.findMany(),
        this.prisma.returnRequest.findMany(),
        this.prisma.expense.findMany(),
        this.prisma.watchlistItem.findMany({
          where: {
            active: true,
          },
        }),
        this.prisma.purchaseOrder.findMany(),
      ]);

    const inventoryCost = toMoney(
      inventory.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0),
    );

    const inventoryExpectedValue = toMoney(
      inventory.reduce(
        (sum, item) =>
          sum +
          Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
            Math.max(item.quantity, 1),
        0,
      ),
    );

    const grossRealizedProfit = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
    );

    const refundAmount = toMoney(
      returns
        .filter((row) => ['approved', 'resolved'].includes(row.status))
        .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
    );

    const operatingExpenses = toMoney(
      expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
    );

    const realizedProfit = toMoney(
      grossRealizedProfit - refundAmount - operatingExpenses,
    );

    const activeBuyNeed = toMoney(
      watchlist.reduce((sum, item) => sum + Number(item.maxBuyPrice ?? 0), 0),
    );

    const openPurchaseOrders = purchaseOrders.filter((order) =>
      ['planned', 'approved', 'ordered', 'paid'].includes(order.status),
    );

    const committedProcurementCost = toMoney(
      openPurchaseOrders.reduce(
        (sum, order) =>
          sum +
          Number(order.totalCost ?? order.actualPrice ?? order.plannedPrice ?? 0),
        0,
      ),
    );

    const receivedProcurementCost = toMoney(
      purchaseOrders
        .filter((order) => order.status === 'received')
        .reduce((sum, order) => sum + Number(order.totalCost ?? 0), 0),
    );

    const byTheme = new Map<string, { cost: number; count: number; units: number }>();

    for (const item of inventory) {
      const theme = item.item?.theme ?? 'Unknown';
      const current = byTheme.get(theme) ?? { cost: 0, count: 0, units: 0 };

      current.cost += Number(item.totalCost ?? 0);
      current.count += 1;
      current.units += item.quantity;

      byTheme.set(theme, current);
    }

    const byWarehouse = new Map<
      string,
      { cost: number; count: number; units: number }
    >();

    for (const item of inventory) {
      const warehouse = item.location?.warehouse?.name ?? 'Unassigned';
      const current = byWarehouse.get(warehouse) ?? {
        cost: 0,
        count: 0,
        units: 0,
      };

      current.cost += Number(item.totalCost ?? 0);
      current.count += 1;
      current.units += item.quantity;

      byWarehouse.set(warehouse, current);
    }

    const byProcurementStatus = new Map<string, { cost: number; count: number }>();

    for (const order of purchaseOrders) {
      const current = byProcurementStatus.get(order.status) ?? {
        cost: 0,
        count: 0,
      };

      current.cost += Number(
        order.totalCost ?? order.actualPrice ?? order.plannedPrice ?? 0,
      );
      current.count += 1;

      byProcurementStatus.set(order.status, current);
    }

    const byReturnStatus = new Map<
      string,
      { refundAmount: number; count: number }
    >();

    for (const row of returns) {
      const current = byReturnStatus.get(row.status) ?? {
        refundAmount: 0,
        count: 0,
      };

      current.refundAmount += Number(row.refundAmount ?? 0);
      current.count += 1;

      byReturnStatus.set(row.status, current);
    }

    const byExpenseCategory = new Map<
      string,
      { amount: number; count: number }
    >();

    for (const expense of expenses) {
      const current = byExpenseCategory.get(expense.category) ?? {
        amount: 0,
        count: 0,
      };

      current.amount += Number(expense.amount ?? 0);
      current.count += 1;

      byExpenseCategory.set(expense.category, current);
    }

    return {
      inventoryCost,
      inventoryExpectedValue,
      unrealizedProfit: toMoney(inventoryExpectedValue - inventoryCost),
      grossRealizedProfit,
      refundAmount,
      operatingExpenses,
      realizedProfit,
      activeBuyNeed,
      committedProcurementCost,
      receivedProcurementCost,
      capitalAtWork: toMoney(inventoryCost + committedProcurementCost),
      inventoryCount: inventory.length,
      inventoryUnits: inventory.reduce((sum, item) => sum + item.quantity, 0),
      byTheme: Array.from(byTheme.entries()).map(([theme, value]) => ({
        theme,
        cost: toMoney(value.cost),
        count: value.count,
        units: value.units,
      })),
      byWarehouse: Array.from(byWarehouse.entries()).map(([warehouse, value]) => ({
        warehouse,
        cost: toMoney(value.cost),
        count: value.count,
        units: value.units,
      })),
      byProcurementStatus: Array.from(byProcurementStatus.entries()).map(
        ([status, value]) => ({
          status,
          cost: toMoney(value.cost),
          count: value.count,
        }),
      ),
      byReturnStatus: Array.from(byReturnStatus.entries()).map(
        ([status, value]) => ({
          status,
          refundAmount: toMoney(value.refundAmount),
          count: value.count,
        }),
      ),
      byExpenseCategory: Array.from(byExpenseCategory.entries()).map(
        ([category, value]) => ({
          category,
          amount: toMoney(value.amount),
          count: value.count,
        }),
      ),
    };
  }

  async getCashflowPlan(params?: {
    monthlyBudget?: number;
    reinvestPercent?: number;
  }): Promise<unknown> {
    const monthlyBudget = params?.monthlyBudget ?? 17000;
    const reinvestPercent = params?.reinvestPercent ?? 80;

    const stats = (await this.getCapitalAllocation()) as any;

    const reinvestAmount = toMoney((monthlyBudget * reinvestPercent) / 100);
    const reserveAmount = toMoney(monthlyBudget - reinvestAmount);

    const averageItemCost =
      stats.inventoryCount > 0 ? stats.inventoryCost / stats.inventoryCount : 1000;

    const estimatedNewItems = Math.floor(reinvestAmount / averageItemCost);

    return {
      monthlyBudget,
      reinvestPercent,
      reinvestAmount,
      reserveAmount,
      averageItemCost: toMoney(averageItemCost),
      estimatedNewItems,
      currentInventoryCost: stats.inventoryCost,
      committedProcurementCost: stats.committedProcurementCost,
      capitalAtWork: stats.capitalAtWork,
      currentExpectedValue: stats.inventoryExpectedValue,
      currentUnrealizedProfit: stats.unrealizedProfit,
      grossRealizedProfit: stats.grossRealizedProfit,
      refundAmount: stats.refundAmount,
      operatingExpenses: stats.operatingExpenses,
      realizedProfit: stats.realizedProfit,
    };
  }
}