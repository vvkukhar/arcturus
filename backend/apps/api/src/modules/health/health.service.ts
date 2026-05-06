import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<unknown> {
    const startedAt = Date.now();

    await this.prisma.$queryRaw`SELECT 1`;

    const [
      items,
      inventory,
      watchlist,
      listings,
      sales,
      notifications,
      syncErrors,
    ] = await Promise.all([
      this.prisma.item.count(),
      this.prisma.inventoryItem.count(),
      this.prisma.watchlistItem.count(),
      this.prisma.marketListing.count(),
      this.prisma.sale.count(),
      this.prisma.notification.count({
        where: {
          read: false,
        },
      }),
      this.prisma.syncErrorLog.count(),
    ]);

    return {
      ok: true,
      service: 'arcturus-api',
      uptimeSec: Math.round(process.uptime()),
      latencyMs: Date.now() - startedAt,
      env: process.env.NODE_ENV ?? 'development',
      database: 'ok',
      counters: {
        items,
        inventory,
        watchlist,
        listings,
        sales,
        unreadNotifications: notifications,
        syncErrors,
      },
      time: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<unknown> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;

      return {
        ready: true,
        database: true,
      };
    } catch (error) {
      return {
        ready: false,
        database: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}