import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { toMoney } from '@arcturus/shared';
import { ActivityService } from '../activity/activity.service';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async list(params?: { type?: string; category?: string; q?: string; limit?: number }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.expense.findMany({
      where: {
        ...(params?.type && params.type !== 'all' ? { type: params.type } : {}),
        ...(params?.category && params.category !== 'all' ? { category: params.category } : {}),
        ...(q
          ? {
              OR: [
                { description: { contains: q, mode: 'insensitive' } },
                { category: { contains: q, mode: 'insensitive' } },
                { type: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      include: {
        inventoryItem: { include: { item: true } },
        purchaseOrder: true,
        sale: true,
        order: true,
        assignedUser: true,
      },
      orderBy: { incurredAt: 'desc' },
      take: params?.limit ?? 200,
    });
  }

  async getById(id: string): Promise<unknown> {
    const expense = await this.prisma.expense.findFirst({
      where: { id },
      include: {
        inventoryItem: { include: { item: true } },
        purchaseOrder: true,
        sale: true,
        order: true,
        assignedUser: true,
      },
    });

    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  private async validateRefs(dto: {
    inventoryItemId?: string | null;
    purchaseOrderId?: string | null;
    saleId?: string | null;
    orderId?: string | null;
    assignedUserId?: string | null;
  }): Promise<void> {
    if (dto.inventoryItemId) {
      const row = await this.prisma.inventoryItem.findUnique({ where: { id: dto.inventoryItemId } });
      if (!row) throw new NotFoundException('Inventory item not found');
    }
    if (dto.purchaseOrderId) {
      const row = await this.prisma.purchaseOrder.findUnique({ where: { id: dto.purchaseOrderId } });
      if (!row) throw new NotFoundException('Purchase order not found');
    }
    if (dto.saleId) {
      const row = await this.prisma.sale.findUnique({ where: { id: dto.saleId } });
      if (!row) throw new NotFoundException('Sale not found');
    }
    if (dto.orderId) {
      const row = await this.prisma.order.findUnique({ where: { id: dto.orderId } });
      if (!row) throw new NotFoundException('Order not found');
    }
    if (dto.assignedUserId) {
      const row = await this.prisma.user.findUnique({ where: { id: dto.assignedUserId } });
      if (!row) throw new NotFoundException('Assigned user not found');
    }
  }

  async create(dto: CreateExpenseDto): Promise<unknown> {
    if (!Number.isFinite(dto.amount) || dto.amount <= 0) {
      throw new BadRequestException('amount must be positive');
    }

    await this.validateRefs(dto);

    const created = await this.prisma.expense.create({
      data: {
        type: dto.type.trim(),
        category: dto.category.trim(),
        amount: toMoney(dto.amount),
        currency: dto.currency ?? 'UAH',
        description: dto.description ?? null,
        inventoryItemId: dto.inventoryItemId ?? null,
        purchaseOrderId: dto.purchaseOrderId ?? null,
        saleId: dto.saleId ?? null,
        orderId: dto.orderId ?? null,
        assignedUserId: dto.assignedUserId ?? null,
        incurredAt: dto.incurredAt ? new Date(dto.incurredAt) : new Date(),
      },
      include: {
        inventoryItem: true,
        purchaseOrder: true,
        sale: true,
        order: true,
        assignedUser: true,
      },
    });

    await this.activity.log('expense.created', {
      expenseId: created.id,
      type: created.type,
      category: created.category,
      amount: created.amount,
    });

    this.realtime.emitCustom('expense.created', created);
    this.realtime.emitDashboardRefresh('expense_created');

    return created;
  }

  async update(dto: UpdateExpenseDto): Promise<unknown> {
    const existing = await this.prisma.expense.findFirst({ where: { id: dto.id } });

    if (!existing) throw new NotFoundException('Expense not found');
    if (dto.amount !== undefined && (!Number.isFinite(dto.amount) || dto.amount <= 0)) {
      throw new BadRequestException('amount must be positive');
    }

    await this.validateRefs(dto);

    const updated = await this.prisma.expense.update({
      where: { id: dto.id },
      data: {
        type: dto.type?.trim(),
        category: dto.category?.trim(),
        amount: dto.amount === undefined ? undefined : toMoney(dto.amount),
        currency: dto.currency,
        description: dto.description,
        inventoryItemId: dto.inventoryItemId,
        purchaseOrderId: dto.purchaseOrderId,
        saleId: dto.saleId,
        orderId: dto.orderId,
        assignedUserId: dto.assignedUserId,
        incurredAt: dto.incurredAt ? new Date(dto.incurredAt) : undefined,
      },
      include: {
        inventoryItem: true,
        purchaseOrder: true,
        sale: true,
        order: true,
        assignedUser: true,
      },
    });

    await this.activity.log('expense.updated', {
      expenseId: updated.id,
      type: updated.type,
      category: updated.category,
      amount: updated.amount,
    });

    this.realtime.emitCustom('expense.updated', updated);
    this.realtime.emitDashboardRefresh('expense_updated');

    return updated;
  }

  async delete(id: string): Promise<unknown> {
    const existing = await this.prisma.expense.findFirst({ where: { id } });

    if (!existing) throw new NotFoundException('Expense not found');

    const deleted = await this.prisma.expense.delete({
      where: { id }
    });

    await this.activity.log('expense.deleted', {
      expenseId: id,
      type: existing.type,
      category: existing.category,
      amount: existing.amount,
    });

    this.realtime.emitCustom('expense.deleted', deleted);
    this.realtime.emitDashboardRefresh('expense_deleted');

    return deleted;
  }

  async stats(): Promise<unknown> {
    const expenses = await this.prisma.expense.findMany();

    const total = toMoney(expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0));
    const byType = new Map<string, { amount: number; count: number }>();
    const byCategory = new Map<string, { amount: number; count: number }>();

    for (const expense of expenses) {
      const type = byType.get(expense.type) ?? { amount: 0, count: 0 };
      type.amount += Number(expense.amount ?? 0);
      type.count += 1;
      byType.set(expense.type, type);

      const category = byCategory.get(expense.category) ?? { amount: 0, count: 0 };
      category.amount += Number(expense.amount ?? 0);
      category.count += 1;
      byCategory.set(expense.category, category);
    }

    return {
      total,
      count: expenses.length,
      byType: Array.from(byType.entries()).map(([type, value]) => ({
        type,
        amount: toMoney(value.amount),
        count: value.count,
      })),
      byCategory: Array.from(byCategory.entries()).map(([category, value]) => ({
        category,
        amount: toMoney(value.amount),
        count: value.count,
      })),
    };
  }
}