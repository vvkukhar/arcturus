import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { ActivityService } from './activity.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('action') action?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.activityService.list({
      q,
      action,
      limit: limit ? Number(limit) : 100,
    });
  }

  @Get('stats')
  stats(): Promise<unknown> {
    return this.activityService.stats();
  }
}