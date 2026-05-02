import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '../../common/money.utils';

@Injectable()
export class ProfitAnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getSummary(): Promise<unknown> {
    const sales = await this.prisma.sale.findMany({
      include: {
        inventoryItem: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalRevenue = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.sellPrice ?? 0), 0),
    );

    const totalProfit = toMoney(
      sales.reduce((sum, sale) => sum + Number(sale.profit ?? 0), 0),
    );

    const avgProfit =
      sales.length > 0 ? toMoney(totalProfit / sales.length) : 0;

    const avgRevenue =
      sales.length > 0 ? toMoney(totalRevenue / sales.length) : 0;

    const bestSale = [...sales].sort(
      (a, b) => Number(b.profit ?? 0) - Number(a.profit ?? 0),
    )[0];

    return {
      salesCount: sales.length,
      totalRevenue,
      totalProfit,
      avgProfit,
      avgRevenue,
      bestSale: bestSale ?? null,
      recentSales: sales.slice(0, 20),
    };
  }

  async getMonthlyBreakdown(): Promise<unknown[]> {
    const sales = await this.prisma.sale.findMany({
      include: {
        inventoryItem: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const map = new Map<
      string,
      {
        month: string;
        salesCount: number;
        revenue: number;
        profit: number;
      }
    >();

    for (const sale of sales) {
      const date = sale.createdAt;
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
        2,
        '0',
      )}`;

      const current =
        map.get(month) ??
        {
          month,
          salesCount: 0,
          revenue: 0,
          profit: 0,
        };

      current.salesCount += 1;
      current.revenue += Number(sale.sellPrice ?? 0);
      current.profit += Number(sale.profit ?? 0);

      map.set(month, current);
    }

    return [...map.values()].map((row) => ({
      ...row,
      revenue: toMoney(row.revenue),
      profit: toMoney(row.profit),
      avgProfit: row.salesCount > 0 ? toMoney(row.profit / row.salesCount) : 0,
    }));
  }

  async getProfitByTheme(): Promise<unknown[]> {
    const sales = await this.prisma.sale.findMany({
      include: {
        inventoryItem: {
          include: {
            item: true,
          },
        },
      },
    });

    const map = new Map<
      string,
      {
        theme: string;
        salesCount: number;
        revenue: number;
        profit: number;
      }
    >();

    for (const sale of sales) {
      const theme = sale.inventoryItem?.item?.theme ?? 'Unknown';

      const current =
        map.get(theme) ??
        {
          theme,
          salesCount: 0,
          revenue: 0,
          profit: 0,
        };

      current.salesCount += 1;
      current.revenue += Number(sale.sellPrice ?? 0);
      current.profit += Number(sale.profit ?? 0);

      map.set(theme, current);
    }

    return [...map.values()]
      .map((row) => ({
        ...row,
        revenue: toMoney(row.revenue),
        profit: toMoney(row.profit),
        avgProfit: row.salesCount > 0 ? toMoney(row.profit / row.salesCount) : 0,
      }))
      .sort((a, b) => b.profit - a.profit);
  }

  async getSalesVelocity(days = 30): Promise<unknown> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [sales, inventory] = await Promise.all([
      this.prisma.sale.findMany({
        where: {
          createdAt: {
            gte: since,
          },
        },
      }),
      this.prisma.inventoryItem.findMany(),
    ]);

    const unitsSold = sales.length;
    const activeUnits = inventory.reduce(
      (sum, item) => sum + Number(item.quantity ?? 0),
      0,
    );

    const soldPerDay = days > 0 ? unitsSold / days : 0;
    const estimatedDaysToClear =
      soldPerDay > 0 ? Math.ceil(activeUnits / soldPerDay) : null;

    return {
      windowDays: days,
      unitsSold,
      activeUnits,
      soldPerDay: Number(soldPerDay.toFixed(2)),
      estimatedDaysToClear,
      velocityTier:
        soldPerDay >= 2
          ? 'fast'
          : soldPerDay >= 0.5
            ? 'medium'
            : 'slow',
    };
  }
}