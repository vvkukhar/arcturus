import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { SyncRunsService } from './sync-runs.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('sync-runs')
export class SyncRunsController {
  constructor(private readonly syncRuns: SyncRunsService) {}

  @Get()
  getRuns(@Query('limit') limit?: string): Promise<unknown[]> {
    return this.syncRuns.getRuns(limit ? Number(limit) : 50);
  }

  @Get('errors')
  getErrors(@Query('limit') limit?: string): Promise<unknown[]> {
    return this.syncRuns.getErrors(limit ? Number(limit) : 50);
  }
}