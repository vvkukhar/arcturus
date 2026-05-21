import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AiSuggestionsService } from './ai-suggestions.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ai')
export class AiSuggestionsController {
  constructor(private readonly service: AiSuggestionsService) {}

  @Get('suggestions')
  getSuggestions() {
    return this.service.getSuggestions();
  }

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
  ) {
    return this.service.explainDeal(body);
  }
}