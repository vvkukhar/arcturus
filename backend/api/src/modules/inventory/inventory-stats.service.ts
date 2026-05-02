import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '../../common/money.utils';

@Injectable()
export class InventoryStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats(): Promise<unknown> {
    const rows = await this.prisma.inventoryItem.findMany({
      include: {
        item: true,
      },
    });

    const totalItems = rows.length;
    const totalUnits = rows.reduce((sum, item) => sum + item.quantity, 0);
    const availableItems = rows.filter((item) => item.quantity > 0).length;

    const totalCost = toMoney(
      rows.reduce((sum, item) => sum + Number(item.totalCost ?? 0), 0),
    );

    const expectedRevenue = toMoney(
      rows.reduce(
        (sum, item) =>
          sum +
          Number(item.expectedSalePriceManual ?? item.totalCost ?? 0) *
            item.quantity,
        0,
      ),
    );

    const byTheme = new Map<
      string,
      {
        theme: string;
        items: number;
        units: number;
        cost: number;
        expectedRevenue: number;
      }
    >();

    for (const row of rows) {
      const theme = row.item?.theme ?? 'Unknown';

      const current =
        byTheme.get(theme) ??
        {
          theme,
          items: 0,
          units: 0,
          cost: 0,
          expectedRevenue: 0,
        };

      current.items += 1;
      current.units += row.quantity;
      current.cost += Number(row.totalCost ?? 0);
      current.expectedRevenue +=
        Number(row.expectedSalePriceManual ?? row.totalCost ?? 0) * row.quantity;

      byTheme.set(theme, current);
    }

    return {
      totalItems,
      totalUnits,
      availableItems,
      outOfStockItems: rows.filter((item) => item.quantity <= 0).length,
      totalCost,
      expectedRevenue,
      expectedProfit: toMoney(expectedRevenue - totalCost),
      byTheme: [...byTheme.values()]
        .map((row) => ({
          ...row,
          cost: toMoney(row.cost),
          expectedRevenue: toMoney(row.expectedRevenue),
          expectedProfit: toMoney(row.expectedRevenue - row.cost),
        }))
        .sort((a, b) => b.expectedRevenue - a.expectedRevenue),
    };
  }
}