import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  health(): Promise<unknown> {
    return this.healthService.getHealth();
  }

  @Get('ready')
  ready(): Promise<unknown> {
    return this.healthService.getReadiness();
  }
}