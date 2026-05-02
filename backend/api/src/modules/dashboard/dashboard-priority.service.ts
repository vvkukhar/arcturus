import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardPriorityService {
  constructor(private readonly prisma: PrismaService) {}

  async getPriorityQueue(): Promise<unknown[]> {
    return this.prisma.decisionSnapshot.findMany({
      orderBy: {
        score: 'desc',
      },
      take: 20,
    });
  }
}