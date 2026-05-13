import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
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