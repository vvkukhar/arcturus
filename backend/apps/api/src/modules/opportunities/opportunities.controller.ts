import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { OpportunitiesService } from './opportunities.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  @Get('buy')
  getBuy(
    @Query('limit') limit?: string,
    @Query('minScore') minScore?: string,
  ): Promise<unknown[]> {
    return this.opportunitiesService.getBuyOpportunities({
      limit: limit ? Number(limit) : 50,
      minScore: minScore ? Number(minScore) : 0,
    });
  }

  @Get('sell')
  getSell(
    @Query('limit') limit?: string,
    @Query('minScore') minScore?: string,
  ): Promise<unknown[]> {
    return this.opportunitiesService.getSellOpportunities({
      limit: limit ? Number(limit) : 50,
      minScore: minScore ? Number(minScore) : 0,
    });
  }

  @Get('buy/:itemId')
  getBuyDetail(@Param('itemId') itemId: string): Promise<unknown> {
    return this.opportunitiesService.getBuyOpportunityDetail(itemId);
  }

  @Get('sell/:itemId')
  getSellDetail(@Param('itemId') itemId: string): Promise<unknown> {
    return this.opportunitiesService.getSellOpportunityDetail(itemId);
  }
}