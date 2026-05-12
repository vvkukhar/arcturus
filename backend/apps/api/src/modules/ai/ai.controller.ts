import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@Controller('ai')
@UseGuards(AdminGuard)
export class AiController {
  constructor(private readonly aiService: OpenAiService) {}

  @Post('explain-deal')
  async explain(@Body() body: any) {
    return this.aiService.analyzeDeal(body);
  }

  @Get('market-suggestions')
  async getSuggestions() {
    const dummyTrends = { popularThemes: ['Star Wars', 'Ninjago'], volatility: 'low' };
    return this.aiService.generateMarketInsight(dummyTrends);
  }
}