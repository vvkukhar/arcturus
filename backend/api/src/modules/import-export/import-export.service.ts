import { BadRequestException, Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { ActivityService } from '../activity/activity.service';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ImportExportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly audit: AuditService,
  ) {}

  private escapeCsv(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    const raw =
      value instanceof Date ? value.toISOString() : String(value);

    if (raw.includes(',') || raw.includes('"') || raw.includes('\n')) {
      return `"${raw.replace(/"/g, '""')}"`;
    }

    return raw;
  }

  private toCsv(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) {
      return '';
    }

    const headers = Object.keys(rows[0]);

    return [
      headers.join(','),
      ...rows.map((row) =>
        headers.map((header) => this.escapeCsv(row[header])).join(','),
      ),
    ].join('\n');
  }

  private parseCsv(csv: string): Record<string, string>[] {
    const lines = csv
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length < 2) {
      throw new BadRequestException('CSV must contain header and at least one row');
    }

    const headers = this.parseCsvLine(lines[0]);

    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);
      const row: Record<string, string> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] ?? '';
      });

      return row;
    });
  }

  private parseCsvLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let index = 0; index < line.length; index += 1) {
      const char = line[index];
      const next = line[index + 1];

      if (char === '"' && insideQuotes && next === '"') {
        current += '"';
        index += 1;
        continue;
      }

      if (char === '"') {
        insideQuotes = !insideQuotes;
        continue;
      }

      if (char === ',' && !insideQuotes) {
        result.push(current.trim());
        current = '';
        continue;
      }

      current += char;
    }

    result.push(current.trim());

    return result;
  }

  async exportInventory(): Promise<string> {
    const rows = await this.prisma.inventoryItem.findMany({
      include: {
        item: true,
        location: {
          include: {
            warehouse: true,
          },
        },
        assignedUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        itemId: row.itemId,
        title: row.titleSnapshot,
        setNumber: row.item.setNumber,
        theme: row.item.theme,
        quantity: row.quantity,
        purchasePrice: row.purchasePrice,
        totalCost: row.totalCost,
        expectedSalePriceManual: row.expectedSalePriceManual,
        condition: row.condition,
        sealed: row.sealed,
        source: row.source,
        storageLocation: row.storageLocation,
        warehouse: row.location?.warehouse?.name ?? '',
        assignedUser: row.assignedUser?.email ?? '',
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
      })),
    );
  }

  async exportSales(): Promise<string> {
    const rows = await this.prisma.sale.findMany({
      include: {
        item: true,
        inventoryItem: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        inventoryItemId: row.inventoryItemId,
        itemId: row.itemId,
        title: row.inventoryItem.titleSnapshot,
        setNumber: row.item.setNumber,
        theme: row.item.theme,
        quantity: row.quantity,
        sellPrice: row.sellPrice,
        costBasis: row.costBasis,
        profit: row.profit,
        roiPercent: row.roiPercent,
        channel: row.channel,
        buyerName: row.buyerName,
        createdAt: row.createdAt,
      })),
    );
  }

  async exportExpenses(): Promise<string> {
    const rows = await this.prisma.expense.findMany({
      orderBy: {
        incurredAt: 'desc',
      },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        type: row.type,
        category: row.category,
        amount: row.amount,
        currency: row.currency,
        description: row.description,
        inventoryItemId: row.inventoryItemId,
        purchaseOrderId: row.purchaseOrderId,
        saleId: row.saleId,
        orderId: row.orderId,
        assignedUserId: row.assignedUserId,
        incurredAt: row.incurredAt,
      })),
    );
  }

  async exportWatchlist(): Promise<string> {
    const rows = await this.prisma.watchlistItem.findMany({
      include: {
        item: true,
        assignedUser: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        itemId: row.itemId,
        title: row.titleSnapshot,
        setNumber: row.item.setNumber,
        theme: row.item.theme,
        desiredBuyPrice: row.desiredBuyPrice,
        maxBuyPrice: row.maxBuyPrice,
        targetSellPrice: row.targetSellPrice,
        active: row.active,
        priority: row.priority,
        assignedUser: row.assignedUser?.email ?? '',
        notes: row.notes,
        createdAt: row.createdAt,
      })),
    );
  }

  async importItems(csv: string, dryRun = false): Promise<unknown> {
    const rows = this.parseCsv(csv);
    const result = [];

    for (const row of rows) {
      const title = row.title?.trim();

      if (!title) {
        result.push({
          ok: false,
          error: 'Missing title',
          row,
        });
        continue;
      }

      const data = {
        title,
        setNumber: row.setNumber?.trim() || null,
        theme: row.theme?.trim() || null,
        kind: row.kind?.trim() || 'set',
        conditionDefault: row.conditionDefault?.trim() || 'used',
        imageUrl: row.imageUrl?.trim() || null,
        notes: row.notes?.trim() || null,
      };

      if (dryRun) {
        result.push({
          ok: true,
          dryRun: true,
          data,
        });
        continue;
      }

      const created = await this.prisma.item.create({
        data,
      });

      result.push({
        ok: true,
        id: created.id,
      });
    }

    await this.activity.log('import.items_csv', {
      dryRun,
      rows: rows.length,
      created: result.filter((row: any) => row.ok && !row.dryRun).length,
    });

    await this.audit.log({
      action: 'import.items_csv',
      entityType: 'Item',
      entityId: null,
      beforeJson: null,
      afterJson: {
        dryRun,
        rows: rows.length,
      },
    });

    return {
      dryRun,
      rows: rows.length,
      result,
    };
  }

  async importExpenses(csv: string, dryRun = false): Promise<unknown> {
    const rows = this.parseCsv(csv);
    const result = [];

    for (const row of rows) {
      const amount = Number(row.amount ?? 0);

      if (!Number.isFinite(amount) || amount <= 0) {
        result.push({
          ok: false,
          error: 'Invalid amount',
          row,
        });
        continue;
      }

      const data = {
        type: row.type?.trim() || 'operations',
        category: row.category?.trim() || 'misc',
        amount: toMoney(amount),
        currency: row.currency?.trim() || 'UAH',
        description: row.description?.trim() || null,
        inventoryItemId: row.inventoryItemId?.trim() || null,
        purchaseOrderId: row.purchaseOrderId?.trim() || null,
        saleId: row.saleId?.trim() || null,
        orderId: row.orderId?.trim() || null,
        assignedUserId: row.assignedUserId?.trim() || null,
        incurredAt: row.incurredAt ? new Date(row.incurredAt) : new Date(),
      };

      if (dryRun) {
        result.push({
          ok: true,
          dryRun: true,
          data,
        });
        continue;
      }

      const created = await this.prisma.expense.create({
        data,
      });

      result.push({
        ok: true,
        id: created.id,
      });
    }

    await this.activity.log('import.expenses_csv', {
      dryRun,
      rows: rows.length,
      created: result.filter((row: any) => row.ok && !row.dryRun).length,
    });

    await this.audit.log({
      action: 'import.expenses_csv',
      entityType: 'Expense',
      entityId: null,
      beforeJson: null,
      afterJson: {
        dryRun,
        rows: rows.length,
      },
    });

    return {
      dryRun,
      rows: rows.length,
      result,
    };
  }
}