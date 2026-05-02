import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OperatorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async getUnresolvedMatches(status = 'pending', limit = 50): Promise<unknown[]> {
    return this.prisma.unresolvedMatchQueue.findMany({
      where: {
        status,
      },
      include: {
        listing: {
          include: {
            source: true,
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      take: limit,
    });
  }

  async resolveMatch(params: {
    queueId: string;
    itemId: string;
    operatorNote?: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: {
        id: params.queueId,
      },
      include: {
        listing: true,
      },
    });

    if (queueItem == null) {
      throw new NotFoundException('Queue item not found');
    }

    const targetItem = await this.prisma.item.findUnique({
      where: {
        id: params.itemId,
      },
    });

    if (!targetItem) {
      throw new NotFoundException('Target item not found');
    }

    const result = await this.prisma.$transaction(async (tx) => {
      await tx.marketListing.update({
        where: {
          id: queueItem.listingId,
        },
        data: {
          itemId: params.itemId,
        },
      });

      return tx.unresolvedMatchQueue.update({
        where: {
          id: params.queueId,
        },
        data: {
          suggestedItemId: params.itemId,
          operatorNote: params.operatorNote,
          status: 'resolved',
        },
        include: {
          listing: true,
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

    return result;
  }

  async dismissMatch(params: {
    queueId: string;
    operatorNote?: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: {
        id: params.queueId,
      },
    });

    if (queueItem == null) {
      throw new NotFoundException('Queue item not found');
    }

    const updated = await this.prisma.unresolvedMatchQueue.update({
      where: {
        id: params.queueId,
      },
      data: {
        operatorNote: params.operatorNote,
        status: 'dismissed',
      },
    });

    this.realtime.emitCustom('operator.match_dismissed', {
      queueId: params.queueId,
    });

    return updated;
  }

  async updateOperatorNote(params: {
    queueId: string;
    operatorNote: string;
  }): Promise<unknown> {
    const queueItem = await this.prisma.unresolvedMatchQueue.findUnique({
      where: {
        id: params.queueId,
      },
    });

    if (queueItem == null) {
      throw new NotFoundException('Queue item not found');
    }

    return this.prisma.unresolvedMatchQueue.update({
      where: {
        id: params.queueId,
      },
      data: {
        operatorNote: params.operatorNote,
      },
    });
  }

  async getUnresolvedSummary(): Promise<{
    pending: number;
    resolved: number;
    dismissed: number;
    total: number;
  }> {
    const [pending, resolved, dismissed] = await Promise.all([
      this.prisma.unresolvedMatchQueue.count({
        where: {
          status: 'pending',
        },
      }),
      this.prisma.unresolvedMatchQueue.count({
        where: {
          status: 'resolved',
        },
      }),
      this.prisma.unresolvedMatchQueue.count({
        where: {
          status: 'dismissed',
        },
      }),
    ]);

    return {
      pending,
      resolved,
      dismissed,
      total: pending + resolved + dismissed,
    };
  }

  async getOperatorDashboard(): Promise<unknown> {
    const [summary, oldestPending, recentResolved] = await Promise.all([
      this.getUnresolvedSummary(),
      this.prisma.unresolvedMatchQueue.findMany({
        where: {
          status: 'pending',
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 10,
        include: {
          listing: {
            include: {
              source: true,
            },
          },
        },
      }),
      this.prisma.unresolvedMatchQueue.findMany({
        where: {
          status: 'resolved',
        },
        orderBy: {
          updatedAt: 'desc',
        },
        take: 10,
        include: {
          listing: true,
        },
      }),
    ]);

    return {
      summary,
      oldestPending,
      recentResolved,
    };
  }
}