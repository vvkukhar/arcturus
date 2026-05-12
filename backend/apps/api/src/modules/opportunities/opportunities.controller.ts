import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('arbitrage')
  async getArbitrage(@Query('limit') limit?: string): Promise<unknown[]> {
    const l = limit ? Number(limit) : 50;
    const decisions = await this.prisma.decisionSnapshot.findMany({
      where: { contextType: 'global_arbitrage', executionStatus: 'pending' },
      include: { item: true },
      orderBy: { score: 'desc' },
      take: l,
    });

    return decisions.map(d => ({
      id: d.id,
      itemId: d.itemId,
      title: d.item.title,
      action: d.action,
      score: d.score,
      ...d.payloadJson as object
    }));
  }
}