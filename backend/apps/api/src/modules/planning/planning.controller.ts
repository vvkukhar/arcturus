import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService } from '../ai/ai.service';
import { RedisService } from '../redis/redis.service';

@Controller('planning')
@UseGuards(JwtAuthGuard)
export class PlanningController {
  constructor(
    private readonly aiService: AiService,
    private readonly redis: RedisService,
  ) {}

  @Get('daily')
  async getDailyPlan() {
    const cacheKey = 'daily_execution_plan';
    const cached = await this.redis.get(cacheKey);
    
    if (cached) {
      return cached;
    }

    const plan = await this.aiService.generateDailyPlan();
    await this.redis.set(cacheKey, plan, 1800); 

    return plan;
  }
}