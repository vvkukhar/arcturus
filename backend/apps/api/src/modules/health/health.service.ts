import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<unknown> {
    // ВАЖЛИВО: Render дуже часто пінгує цей роут. Ми робимо його максимально легким, 
    // щоб не навантажувати базу і не відвалюватися по тайм-ауту під час деплою.
    return {
      status: 'ok',
      service: 'arcturus-api',
      uptimeSec: Math.round(process.uptime()),
      env: process.env.NODE_ENV ?? 'development',
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