import { Controller, Get, Query, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PrismaService } from '../prisma/prisma.service';
import { OpportunitiesService } from './opportunities.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly opportunitiesService: OpportunitiesService
  ) {}

  @Get('buy')
  async getBuy(@Query('limit') limit?: string, @Query('minScore') minScore?: string): Promise<unknown[]> {
    return this.opportunitiesService.getBuyOpportunities({
      limit: limit ? Number(limit) : 50,
      minScore: minScore ? Number(minScore) : 0,
    });
  }

  @Get('sell')
  async getSell(@Query('limit') limit?: string, @Query('minScore') minScore?: string): Promise<unknown[]> {
    return this.opportunitiesService.getSellOpportunities({
      limit: limit ? Number(limit) : 50,
      minScore: minScore ? Number(minScore) : 0,
    });
  }

  @Get('buy/:id')
  async getBuyDetail(@Param('id') id: string): Promise<unknown> {
    return this.opportunitiesService.getBuyOpportunityDetail(id);
  }

  @Get('sell/:id')
  async getSellDetail(@Param('id') id: string): Promise<unknown> {
    return this.opportunitiesService.getSellOpportunityDetail(id);
  }

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
      ...(d.payloadJson as object)
    }));
  }
}