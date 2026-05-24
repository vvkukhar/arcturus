import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<unknown> {
    // Перевіряємо, чи працюють основні "артерії"
    const [snapshotCount, listingCount] = await Promise.all([
      this.prisma.marketSnapshot.count({ where: { computedAt: { gte: new Date(Date.now() - 3600000) } } }), // за останню годину
      this.prisma.marketListing.count({ where: { fetchedAt: { gte: new Date(Date.now() - 3600000) } } })
    ]);

    return {
      status: snapshotCount > 0 ? 'healthy' : 'degraded',
      uptimeSec: Math.round(process.uptime()),
      metrics: { snapshotCount, listingCount },
      time: new Date().toISOString(),
    };
  }

  async getReadiness(): Promise<unknown> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        ready: true,
        database: 'connected',
      };
    } catch (error) {
      return {
        ready: false,
        database: 'disconnected',
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }
}