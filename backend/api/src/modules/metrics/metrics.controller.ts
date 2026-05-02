import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MetricsService } from './metrics.service';

@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  json(): Promise<unknown> {
    return this.metricsService.getJsonMetrics();
  }

  @Get('prometheus')
  @Header('Content-Type', 'text/plain; version=0.0.4')
  prometheus(): Promise<string> {
    return this.metricsService.getPrometheusMetrics();
  }

  @Get('queues')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  queues(): Promise<unknown[]> {
    return this.metricsService.getQueueHealth();
  }

  @Get('db')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  db(): Promise<unknown> {
    return this.metricsService.getDbHealth();
  }
}