import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncRunsService {
  constructor(private readonly prisma: PrismaService) {}

  async getRuns(limit = 50): Promise<unknown[]> {
    return this.prisma.sourceRunLog.findMany({
      orderBy: { startedAt: 'desc' },
      include: { source: true },
      take: limit,
    });
  }

  async getErrors(limit = 50): Promise<unknown[]> {
    return this.prisma.syncErrorLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}