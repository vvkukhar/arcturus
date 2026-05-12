import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  async log(action: string, payloadJson: any): Promise<any> {
    return this.prisma.activityLog.create({
      data: {
        action,
        payloadJson,
      },
    });
  }

  async getLogs(limit: number = 100): Promise<any[]> {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}