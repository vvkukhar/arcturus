import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { toMoney } from '../../common/money.utils';
import { PrismaService } from '../prisma/prisma.service';

type PeriodParams = {
  from?: string;
  to?: string;
};

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  private getRange(params?: PeriodParams): {
    from: Date;
    to: Date;
  } {
    const now = new Date();

    const from = params?.from
      ? new Date(params.from)
      : new Date(now.getFullYear(), now.getMonth(), 1);

    const to = params?.to ? new Date(params.to) : now;

    return {
      from,
      to,
    };
  }

  private inRangeWhere(field: string, from: Date, to: Date): Record<string, unknown> {
    return {
      [field]: {
        gte: from,
        lte: to,
      },
    };
  }

  async profitAndLoss(params?: PeriodParams): Promise<unknown> {
    const { from, to } = this.getRange(params);

    const [sales, returns, expenses, purchaseOrders] = await Promise.all([
      this.prisma.sale.findMany({
        where: this.inRangeWhere('createdAt', from, to),
        include: {
          item: true,
          inventoryItem: true,
        },
      }),
      this.prisma.returnRequest.findMany({
        where: this.inRangeWhere('createdAt', from, to),
      }),
      this.prisma.expense.findMany({
        where: this.inRangeWhere('incurredAt', from, to),
      }),
      this.prisma.purchaseOrder.findMany({
        where: this.inRangeWhere('createdAt', from, to),
      }),
    ]);

    const grossRevenue = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0),
    );

    const cogs = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.costBasis ?? 0), 0),
    );

    const grossProfit = toMoney(grossRevenue - cogs);

    const refunds = toMoney(
      returns
        .filter((row) => ['approved', 'resolved'].includes(row.status))
        .reduce((sum, row) => sum + Number(row.refundAmount ?? 0), 0),
    );

    const operatingExpenses = toMoney(
      expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0),
    );

    const procurementCommitted = toMoney(
      purchaseOrders
        .filter((order) => ['planned', 'approved', 'ordered', 'paid'].includes(order.status))
        .reduce(
          (sum, order) =>
            sum +
            Number(order.totalCost ?? order.actualPrice ?? order.plannedPrice ?? 0),
          0,
        ),
    );

    const netRevenue = toMoney(grossRevenue - refunds);
    const netProfitBeforeExpenses = toMoney(grossProfit - refunds);
    const netProfit = toMoney(netProfitBeforeExpenses - operatingExpenses);

    const marginPercent =
      netRevenue > 0 ? toMoney((netProfit / netRevenue) * 100) : 0;

    const roiPercent = cogs > 0 ? toMoney((netProfit / cogs) * 100) : 0;

    return {
      period: {
        from: from.toISOString(),
        to: to.toISOString(),
      },
      revenue: {
        grossRevenue,
        refunds,
        netRevenue,
      },
      costs: {
        cogs,
        operatingExpenses,
        procurementCommitted,
      },
      profit: {
        grossProfit,
        netProfitBeforeExpenses,
        netProfit,
        marginPercent,
        roiPercent,
      },
      counters: {
        sales: sales.length,
        returns: returns.length,
        expenses: expenses.length,
        purchaseOrders: purchaseOrders.length,
      },
    };
  }

  async salesByTheme(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);

    const sales = await this.prisma.sale.findMany({
      where: this.inRangeWhere('createdAt', from, to),
      include: {
        item: true,
      },
    });

    const map = new Map<
      string,
      {
        revenue: number;
        cost: number;
        profit: number;
        units: number;
        sales: number;
      }
    >();

    for (const sale of sales) {
      const theme = sale.item.theme ?? 'Unknown';
      const current = map.get(theme) ?? {
        revenue: 0,
        cost: 0,
        profit: 0,
        units: 0,
        sales: 0,
      };

      current.revenue += Number(sale.sellPrice ?? 0);
      current.cost += Number(sale.costBasis ?? 0);
      current.profit += Number(sale.profit ?? 0);
      current.units += sale.quantity;
      current.sales += 1;

      map.set(theme, current);
    }

    return Array.from(map.entries())
      .map(([theme, value]) => ({
        theme,
        revenue: toMoney(value.revenue),
        cost: toMoney(value.cost),
        profit: toMoney(value.profit),
        roiPercent: value.cost > 0 ? toMoney((value.profit / value.cost) * 100) : 0,
        units: value.units,
        sales: value.sales,
      }))
      .sort((a, b) => b.profit - a.profit);
  }

  async expensesByCategory(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);

    const expenses = await this.prisma.expense.findMany({
      where: this.inRangeWhere('incurredAt', from, to),
    });

    const map = new Map<string, { amount: number; count: number }>();

    for (const expense of expenses) {
      const current = map.get(expense.category) ?? {
        amount: 0,
        count: 0,
      };

      current.amount += Number(expense.amount ?? 0);
      current.count += 1;

      map.set(expense.category, current);
    }

    return Array.from(map.entries())
      .map(([category, value]) => ({
        category,
        amount: toMoney(value.amount),
        count: value.count,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  async dailyPnl(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);

    const [sales, returns, expenses] = await Promise.all([
      this.prisma.sale.findMany({
        where: this.inRangeWhere('createdAt', from, to),
      }),
      this.prisma.returnRequest.findMany({
        where: this.inRangeWhere('createdAt', from, to),
      }),
      this.prisma.expense.findMany({
        where: this.inRangeWhere('incurredAt', from, to),
      }),
    ]);

    const map = new Map<
      string,
      {
        revenue: number;
        cost: number;
        profit: number;
        refunds: number;
        expenses: number;
      }
    >();

    const ensure = (date: Date) => {
      const key = date.toISOString().slice(0, 10);
      const current =
        map.get(key) ??
        {
          revenue: 0,
          cost: 0,
          profit: 0,
          refunds: 0,
          expenses: 0,
        };

      map.set(key, current);

      return current;
    };

    for (const sale of sales) {
      const row = ensure(sale.createdAt);
      row.revenue += Number(sale.sellPrice ?? 0);
      row.cost += Number(sale.costBasis ?? 0);
      row.profit += Number(sale.profit ?? 0);
    }

    for (const row of returns) {
      if (!['approved', 'resolved'].includes(row.status)) {
        continue;
      }

      ensure(row.createdAt).refunds += Number(row.refundAmount ?? 0);
    }

    for (const expense of expenses) {
      ensure(expense.incurredAt).expenses += Number(expense.amount ?? 0);
    }

    return Array.from(map.entries())
      .map(([date, value]) => ({
        date,
        revenue: toMoney(value.revenue),
        cost: toMoney(value.cost),
        grossProfit: toMoney(value.profit),
        refunds: toMoney(value.refunds),
        expenses: toMoney(value.expenses),
        netProfit: toMoney(value.profit - value.refunds - value.expenses),
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async saveSnapshot(params?: PeriodParams): Promise<unknown> {
    const { from, to } = this.getRange(params);

    const payload = {
      pnl: await this.profitAndLoss({
        from: from.toISOString(),
        to: to.toISOString(),
      }),
      salesByTheme: await this.salesByTheme({
        from: from.toISOString(),
        to: to.toISOString(),
      }),
      expensesByCategory: await this.expensesByCategory({
        from: from.toISOString(),
        to: to.toISOString(),
      }),
      dailyPnl: await this.dailyPnl({
        from: from.toISOString(),
        to: to.toISOString(),
      }),
    };

    return this.prisma.reportSnapshot.create({
      data: {
        type: 'financial',
        periodStart: from,
        periodEnd: to,
        payloadJson: payload as Prisma.InputJsonValue,
      },
    });
  }

  async snapshots(): Promise<unknown[]> {
    return this.prisma.reportSnapshot.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100,
    });
  }
}