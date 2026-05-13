import { BadRequestException, Injectable } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
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
    if (value === null || value === undefined) return '';
    const raw = value instanceof Date ? value.toISOString() : String(value);
    if (raw.includes(',') || raw.includes('"') || raw.includes('\n')) {
      return `"${raw.replace(/"/g, '""')}"`;
    }
    return raw;
  }

  private toCsv(rows: Record<string, unknown>[]): string {
    if (rows.length === 0) return '';
    const headers = Object.keys(rows[0]);
    return [
      headers.join(','),
      ...rows.map((row) => headers.map((header) => this.escapeCsv(row[header])).join(',')),
    ].join('\n');
  }

  private parseCsv(csv: string): Record<string, string>[] {
    const lines = csv.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length < 2) throw new BadRequestException('CSV must contain header and at least one row');
    const headers = this.parseCsvLine(lines[0]);
    return lines.slice(1).map((line) => {
      const values = this.parseCsvLine(line);
      const row: Record<string, string> = {};
      headers.forEach((header, index) => { row[header] = values[index] ?? ''; });
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
      if (char === '"' && insideQuotes && next === '"') { current += '"'; index += 1; continue; }
      if (char === '"') { insideQuotes = !insideQuotes; continue; }
      if (char === ',' && !insideQuotes) { result.push(current.trim()); current = ''; continue; }
      current += char;
    }
    result.push(current.trim());
    return result;
  }

  async exportInventory(): Promise<string> {
    const rows = await this.prisma.inventoryItem.findMany({
      include: { item: true, location: { include: { warehouse: true } }, assignedUser: true },
      orderBy: { createdAt: 'desc' },
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
        warehouse: row.location?.warehouse?.name ?? '',
        createdAt: row.createdAt,
      })) as Record<string, unknown>[],
    );
  }

  async exportSales(): Promise<string> {
    const rows = await this.prisma.sale.findMany({
      include: { item: true, inventoryItem: true },
      orderBy: { createdAt: 'desc' },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        title: row.inventoryItem?.titleSnapshot ?? '',
        setNumber: row.item?.setNumber ?? '',
        quantity: row.quantity,
        sellPrice: row.sellPrice,
        costBasis: row.costBasis,
        profit: row.profit,
        roiPercent: row.roiPercent,
        channel: row.channel,
        buyerName: row.buyerName,
        createdAt: row.createdAt,
      })) as Record<string, unknown>[],
    );
  }

  async exportExpenses(): Promise<string> {
    const rows = await this.prisma.expense.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        type: row.type,
        category: row.category,
        amount: row.amount,
        currency: row.currency,
        description: row.description ?? '',
        incurredAt: row.incurredAt,
        createdAt: row.createdAt,
      })) as Record<string, unknown>[],
    );
  }

  async exportWatchlist(): Promise<string> {
    const rows = await this.prisma.watchlistItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { item: true }
    });

    return this.toCsv(
      rows.map((row) => ({
        id: row.id,
        itemId: row.itemId,
        titleSnapshot: row.titleSnapshot,
        setNumber: row.item?.setNumber ?? '',
        desiredBuyPrice: row.desiredBuyPrice,
        maxBuyPrice: row.maxBuyPrice,
        targetSellPrice: row.targetSellPrice ?? '',
        active: row.active,
        priority: row.priority,
        createdAt: row.createdAt,
      })) as Record<string, unknown>[],
    );
  }

  async importItems(csv: string, dryRun = false): Promise<unknown> {
    const rows = this.parseCsv(csv);
    const validData = [];
    const errors = [];

    for (const row of rows) {
      const title = row.title?.trim();
      if (!title) {
        errors.push({ error: 'Missing title', row });
        continue;
      }
      validData.push({
        title,
        setNumber: row.setNumber?.trim() || null,
        theme: row.theme?.trim() || null,
        kind: row.kind?.trim() || 'set',
        conditionDefault: row.conditionDefault?.trim() || 'used',
      });
    }

    if (!dryRun && validData.length > 0) {
      await this.prisma.item.createMany({ data: validData, skipDuplicates: true });
    }

    return { dryRun, rows: rows.length, successCount: validData.length, errors };
  }

  async importExpenses(csv: string, dryRun = false): Promise<unknown> {
    const rows = this.parseCsv(csv);
    const validData = [];
    const errors = [];

    for (const row of rows) {
      const amount = Number(row.amount);
      if (Number.isNaN(amount) || amount <= 0) {
        errors.push({ error: 'Invalid amount', row });
        continue;
      }
      validData.push({
        type: row.type?.trim() || 'general',
        category: row.category?.trim() || 'other',
        amount: toMoney(amount),
        currency: row.currency?.trim() || 'UAH',
        description: row.description?.trim() || null,
      });
    }

    if (!dryRun && validData.length > 0) {
      await this.prisma.expense.createMany({ data: validData, skipDuplicates: true });
    }

    return { dryRun, rows: rows.length, successCount: validData.length, errors };
  }
}