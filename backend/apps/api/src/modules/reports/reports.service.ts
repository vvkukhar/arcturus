import { Injectable } from '@nestjs/common';
import { Prisma } from '@arcturus/db';
import { toMoney } from '@arcturus/shared';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

type PeriodParams = {
  from?: string;
  to?: string;
};

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private getRange(params?: PeriodParams): { from: Date; to: Date } {
    const now = new Date();
    const from = params?.from ? new Date(params.from) : new Date(now.getFullYear(), now.getMonth(), 1);
    const to = params?.to ? new Date(params.to) : now;
    return { from, to };
  }

  private inRangeWhere(field: string, from: Date, to: Date): Record<string, unknown> {
    return { [field]: { gte: from, lte: to } };
  }

  async profitAndLoss(params?: PeriodParams): Promise<unknown> {
    const { from, to } = this.getRange(params);
    const cacheKey = `reports:pnl:${from.toISOString()}:${to.toISOString()}`;
    const cached = await this.redis.get<unknown>(cacheKey);
    if (cached) return cached;

    const [salesAgg, returnsAgg, expensesAgg, purchaseOrdersAgg] = await Promise.all([
      this.prisma.sale.aggregate({
        _sum: { sellPrice: true, costBasis: true, profit: true },
        _count: { _all: true },
        where: this.inRangeWhere('createdAt', from, to),
      }),
      this.prisma.returnRequest.aggregate({
        _sum: { refundAmount: true },
        _count: { _all: true },
        where: { ...this.inRangeWhere('createdAt', from, to), status: { in: ['approved', 'resolved'] } },
      }),
      this.prisma.expense.aggregate({
        _sum: { amount: true },
        _count: { _all: true },
        where: this.inRangeWhere('incurredAt', from, to),
      }),
      this.prisma.purchaseOrder.aggregate({
        _sum: { totalCost: true, actualPrice: true, plannedPrice: true },
        _count: { _all: true },
        where: { ...this.inRangeWhere('createdAt', from, to), status: { in: ['planned', 'approved', 'ordered', 'paid'] } },
      }),
    ]);

    const grossRevenue = toMoney(salesAgg._sum.sellPrice ?? 0);
    const cogs = toMoney(salesAgg._sum.costBasis ?? 0);
    const grossProfit = toMoney(salesAgg._sum.profit ?? 0);
    const refunds = toMoney(returnsAgg._sum.refundAmount ?? 0);
    const operatingExpenses = toMoney(expensesAgg._sum.amount ?? 0);

    const procurementCommitted = toMoney(
      purchaseOrdersAgg._sum.totalCost ?? purchaseOrdersAgg._sum.actualPrice ?? purchaseOrdersAgg._sum.plannedPrice ?? 0
    );

    const netRevenue = toMoney(grossRevenue - refunds);
    const netProfitBeforeExpenses = toMoney(grossProfit - refunds);
    const netProfit = toMoney(netProfitBeforeExpenses - operatingExpenses);

    const marginPercent = netRevenue > 0 ? toMoney((netProfit / netRevenue) * 100) : 0;
    const roiPercent = cogs > 0 ? toMoney((netProfit / cogs) * 100) : 0;

    const result = {
      period: { from: from.toISOString(), to: to.toISOString() },
      revenue: { grossRevenue, refunds, netRevenue },
      costs: { cogs, operatingExpenses, procurementCommitted },
      profit: { grossProfit, netProfitBeforeExpenses, netProfit, marginPercent, roiPercent },
      counters: {
        sales: salesAgg._count._all,
        returns: returnsAgg._count._all,
        expenses: expensesAgg._count._all,
        purchaseOrders: purchaseOrdersAgg._count._all,
      },
    };

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async salesByTheme(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);
    const cacheKey = `reports:themes:${from.toISOString()}:${to.toISOString()}`;
    const cached = await this.redis.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const sales = await this.prisma.sale.findMany({
      where: this.inRangeWhere('createdAt', from, to),
      select: { sellPrice: true, costBasis: true, profit: true, quantity: true, item: { select: { theme: true } } },
    });

    const map = new Map<string, { revenue: number; cost: number; profit: number; units: number; sales: number }>();

    for (const sale of sales) {
      const theme = sale.item?.theme ?? 'Unknown';
      const current = map.get(theme) ?? { revenue: 0, cost: 0, profit: 0, units: 0, sales: 0 };
      current.revenue += Number(sale.sellPrice ?? 0);
      current.cost += Number(sale.costBasis ?? 0);
      current.profit += Number(sale.profit ?? 0);
      current.units += sale.quantity;
      current.sales += 1;
      map.set(theme, current);
    }

    const result = Array.from(map.entries())
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

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async expensesByCategory(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);
    const agg = await this.prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      _count: { id: true },
      where: this.inRangeWhere('incurredAt', from, to),
    });

    return agg.map(row => ({
      category: row.category,
      amount: toMoney(row._sum.amount ?? 0),
      count: row._count.id
    })).sort((a, b) => b.amount - a.amount);
  }

  async dailyPnl(params?: PeriodParams): Promise<unknown[]> {
    const { from, to } = this.getRange(params);
    const cacheKey = `reports:daily:${from.toISOString()}:${to.toISOString()}`;
    const cached = await this.redis.get<unknown[]>(cacheKey);
    if (cached) return cached;

    const [salesRaw, returnsRaw, expensesRaw] = await Promise.all([
      this.prisma.$queryRaw<{ date: string; revenue: number; cost: number; profit: number }[]>`
        SELECT DATE("createdAt") as date, COALESCE(SUM("sellPrice"), 0) as revenue, COALESCE(SUM("costBasis"), 0) as cost, COALESCE(SUM("profit"), 0) as profit
        FROM "Sale" WHERE "createdAt" >= ${from} AND "createdAt" <= ${to} AND "deletedAt" IS NULL GROUP BY DATE("createdAt")
      `,
      this.prisma.$queryRaw<{ date: string; refunds: number }[]>`
        SELECT DATE("createdAt") as date, COALESCE(SUM("refundAmount"), 0) as refunds
        FROM "ReturnRequest" WHERE status IN ('approved', 'resolved') AND "createdAt" >= ${from} AND "createdAt" <= ${to} GROUP BY DATE("createdAt")
      `,
      this.prisma.$queryRaw<{ date: string; expenses: number }[]>`
        SELECT DATE("incurredAt") as date, COALESCE(SUM("amount"), 0) as expenses
        FROM "Expense" WHERE "incurredAt" >= ${from} AND "incurredAt" <= ${to} AND "deletedAt" IS NULL GROUP BY DATE("incurredAt")
      `,
    ]);

    const map = new Map<string, any>();

    const ensure = (dateObj: any) => {
      const key = new Date(dateObj).toISOString().slice(0, 10);
      if (!map.has(key)) map.set(key, { date: key, revenue: 0, cost: 0, grossProfit: 0, refunds: 0, expenses: 0 });
      return map.get(key);
    };

    for (const row of salesRaw) {
      const entry = ensure(row.date);
      entry.revenue = Number(row.revenue);
      entry.cost = Number(row.cost);
      entry.grossProfit = Number(row.profit);
    }
    for (const row of returnsRaw) {
      ensure(row.date).refunds = Number(row.refunds);
    }
    for (const row of expensesRaw) {
      ensure(row.date).expenses = Number(row.expenses);
    }

    const result = Array.from(map.values()).map(val => ({
      ...val,
      revenue: toMoney(val.revenue),
      cost: toMoney(val.cost),
      grossProfit: toMoney(val.grossProfit),
      refunds: toMoney(val.refunds),
      expenses: toMoney(val.expenses),
      netProfit: toMoney(val.grossProfit - val.refunds - val.expenses),
    })).sort((a, b) => a.date.localeCompare(b.date));

    await this.redis.set(cacheKey, result, 300);
    return result;
  }

  async saveSnapshot(params?: PeriodParams): Promise<unknown> {
    const { from, to } = this.getRange(params);
    const payload = {
      pnl: await this.profitAndLoss({ from: from.toISOString(), to: to.toISOString() }),
      salesByTheme: await this.salesByTheme({ from: from.toISOString(), to: to.toISOString() }),
      expensesByCategory: await this.expensesByCategory({ from: from.toISOString(), to: to.toISOString() }),
      dailyPnl: await this.dailyPnl({ from: from.toISOString(), to: to.toISOString() }),
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
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}