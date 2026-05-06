// backend/api/src/modules/operator/operator.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OperatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  private async attachListing(queueItem: any): Promise<any> {
    const listing = await this.prisma.marketListing.findUnique({
      where: { id: queueItem.listingId },
      include: {
        source: true,
        item: true,
      },
    });

    return {
      ...queueItem,
      listing,
    };
  }

  async getUnresolvedMatches(status = 'pending', limit = 50): Promise<unknown[]> {
    const rows = await this.prisma.unresolvedMatchQueue.findMany({
      where: { status },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });

    return Promise.all(rows.map((row) => this.attachListing(row)));
  }

  async resolveMatch(params: {
    queueId: string;
    itemId: string;
    operatorNote?: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: { id: params.queueId },
    });

    if (!queueItem) {
      throw new NotFoundException('Queue item not found');
    }

    const targetItem = await this.prisma.item.findUnique({
      where: { id: params.itemId },
    });

    if (!targetItem) {
      throw new NotFoundException('Target item not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.marketListing.update({
        where: { id: queueItem.listingId },
        data: { itemId: params.itemId },
      });

      return tx.unresolvedMatchQueue.update({
        where: { id: params.queueId },
        data: {
          suggestedItemId: params.itemId,
          resolvedItemId: params.itemId,
          resolutionNote: params.operatorNote ?? null,
          status: 'resolved',
        },
      });
    });

    this.realtime.emitCustom('operator.match_resolved', {
      queueId: params.queueId,
      itemId: params.itemId,
    });

    this.realtime.emitListingsRefresh({
      reason: 'operator_match_resolved',
      listingId: queueItem.listingId,
    });

    this.realtime.emitItemRefresh(params.itemId, 'operator_match_resolved');
    this.realtime.emitOpportunityRefresh('operator_match_resolved');

    return this.attachListing(result);
  }

  async dismissMatch(params: {
    queueId: string;
    operatorNote?: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: { id: params.queueId },
    });

    if (!queueItem) {
      throw new NotFoundException('Queue item not found');
    }

    const updated = await this.prisma.unresolvedMatchQueue.update({
      where: { id: params.queueId },
      data: {
        resolutionNote: params.operatorNote ?? null,
        status: 'dismissed',
      },
    });

    this.realtime.emitCustom('operator.match_dismissed', {
      queueId: params.queueId,
    });

    return this.attachListing(updated);
  }

  async updateOperatorNote(params: {
    queueId: string;
    operatorNote: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: { id: params.queueId },
    });

    if (!queueItem) {
      throw new NotFoundException('Queue item not found');
    }

    const updated = await this.prisma.unresolvedMatchQueue.update({
      where: { id: params.queueId },
      data: {
        resolutionNote: params.operatorNote,
      },
    });

    return this.attachListing(updated);
  }

  async getUnresolvedSummary(): Promise<{
    pending: number;
    resolved: number;
    dismissed: number;
    total: number;
  }> {
    const [pending, resolved, dismissed] = await Promise.all([
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'pending' } }),
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'resolved' } }),
      this.prisma.unresolvedMatchQueue.count({ where: { status: 'dismissed' } }),
    ]);

    return {
      pending,
      resolved,
      dismissed,
      total: pending + resolved + dismissed,
    };
  }

  async getOperatorDashboard(): Promise<unknown> {
    const [summary, oldestPendingRaw, recentResolvedRaw] = await Promise.all([
      this.getUnresolvedSummary(),
      this.prisma.unresolvedMatchQueue.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'asc' },
        take: 10,
      }),
      this.prisma.unresolvedMatchQueue.findMany({
        where: { status: 'resolved' },
        orderBy: { updatedAt: 'desc' },
        take: 10,
      }),
    ]);

    const [oldestPending, recentResolved] = await Promise.all([
      Promise.all(oldestPendingRaw.map((row) => this.attachListing(row))),
      Promise.all(recentResolvedRaw.map((row) => this.attachListing(row))),
    ]);

    return {
      summary,
      oldestPending,
      recentResolved,
    };
  }
}