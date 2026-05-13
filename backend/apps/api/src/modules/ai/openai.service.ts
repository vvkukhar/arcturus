import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY') || process.env.OPENAI_API_KEY || 'unconfigured_key_fallback',
    });
  }

  async analyzeDeal(data: {
    title: string;
    buyPrice: number;
    marketPrice: number;
    condition: string;
  }) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL') || 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a professional LEGO investment analyst. Evaluate ROI and risks.',
          },
          {
            role: 'user',
            content: `Analyze deal: ${data.title}. Buy: ${data.buyPrice} UAH. Market: ${data.marketPrice} UAH. Condition: ${data.condition}.`,
          },
        ],
        response_format: { type: 'json_object' },
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (e: any) {
      this.logger.error(`AI Analysis failed: ${e.message}`);
      return null;
    }
  }

  async generateMarketInsight(recentTrends: any) {
    try {
      const response = await this.openai.chat.completions.create({
        model: this.configService.get('OPENAI_MODEL') || 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: `Generate 3 investment tips based on these LEGO market trends: ${JSON.stringify(recentTrends)}`,
          },
        ],
      });
      return response.choices[0].message.content;
    } catch (e: any) {
      this.logger.error(`AI Insight failed: ${e.message}`);
      return null;
    }
  }
}