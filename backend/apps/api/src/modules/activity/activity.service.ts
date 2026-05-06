import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class ActivityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async log(action: string, payloadJson?: object): Promise<unknown> {
    const row = await this.prisma.activityLog.create({
      data: {
        action,
        payloadJson: payloadJson ?? {},
      },
    });

    this.realtime.emitCustom('activity.created', row);

    return row;
  }

  async list(params?: {
    q?: string;
    action?: string;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params?.q?.trim();

    return this.prisma.activityLog.findMany({
      where: {
        ...(params?.action && params.action !== 'all'
          ? {
              action: {
                contains: params.action,
                mode: 'insensitive',
              },
            }
          : {}),
        ...(q
          ? {
              OR: [
                {
                  action: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.limit ?? 100,
    });
  }

  async recentByPrefix(prefix: string, limit = 20): Promise<unknown[]> {
    return this.prisma.activityLog.findMany({
      where: {
        action: {
          startsWith: prefix,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }

  async stats(): Promise<unknown> {
    const [
      total,
      inventory,
      watchlist,
      sales,
      scanner,
      operator,
      recent,
    ] = await Promise.all([
      this.prisma.activityLog.count(),
      this.prisma.activityLog.count({
        where: {
          action: {
            startsWith: 'inventory.',
          },
        },
      }),
      this.prisma.activityLog.count({
        where: {
          action: {
            startsWith: 'watchlist.',
          },
        },
      }),
      this.prisma.activityLog.count({
        where: {
          action: {
            startsWith: 'sale.',
          },
        },
      }),
      this.prisma.activityLog.count({
        where: {
          action: {
            startsWith: 'scanner.',
          },
        },
      }),
      this.prisma.activityLog.count({
        where: {
          action: {
            startsWith: 'operator.',
          },
        },
      }),
      this.prisma.activityLog.findMany({
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      }),
    ]);

    return {
      total,
      inventory,
      watchlist,
      sales,
      scanner,
      operator,
      recent,
    };
  }
}