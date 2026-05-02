import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AiService } from './ai.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'operator')
@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('explain-deal')
  explainDeal(
    @Body()
    body: {
      buyPrice: number;
      sellPrice: number;
      marketFloor?: number | null;
      marketAverage?: number | null;
      liquidityScore?: number | null;
    },
  ): unknown {
    return this.aiService.explainDeal(body);
  }

  @Get('suggestions')
  suggestions(): Promise<unknown[]> {
    return this.aiService.suggestions();
  }
}