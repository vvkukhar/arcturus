import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { QueueService } from './queue.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Get('stats')
  stats(): Promise<unknown> {
    return this.queueService.stats();
  }

  @Post('market/snapshots')
  snapshots(): Promise<unknown> {
    return this.queueService.enqueueMarketSnapshots();
  }

  @Post('decisions/recompute')
  decisions(): Promise<unknown> {
    return this.queueService.enqueueDecisions();
  }

  @Post('deals/detect')
  deals(): Promise<unknown> {
    return this.queueService.enqueueDealDetection();
  }

  @Post('scheduled-refresh')
  scheduledRefresh(): Promise<unknown> {
    return this.queueService.enqueueScheduledRefresh();
  }
}