import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  // VERSION_NEUTRAL гарантує, що роут буде /api/health, а не /api/v1/health
  @Version(VERSION_NEUTRAL)
  @Get()
  health(): Promise<unknown> {
    return this.healthService.getHealth();
  }

  @Version(VERSION_NEUTRAL)
  @Get('ready')
  ready(): Promise<unknown> {
    return this.healthService.getReadiness();
  }
}