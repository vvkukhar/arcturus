import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PlanningService } from './planning.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator', 'viewer')
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningService: PlanningService) {}

  @Get('daily')
  async getDailyPlan(): Promise<unknown[]> {
    return this.planningService.getDailyPlan();
  }

  @Get('pressure')
  async getExecutionPressure(): Promise<unknown> {
    return this.planningService.getExecutionPressure();
  }
}