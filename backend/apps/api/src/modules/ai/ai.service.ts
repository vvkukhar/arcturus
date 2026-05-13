import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { PrismaService } from '../prisma/prisma.service';

interface ExplainDealParams {
  buyPrice: number;
  sellPrice: number;
  marketFloor?: number | null;
  marketAverage?: number | null;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private openai: OpenAI;

  constructor(private readonly prisma: PrismaService) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'unconfigured_key_fallback',
    });
  }

  async explainDeal(params: ExplainDealParams): Promise<any> {
    const profit = params.sellPrice - params.buyPrice;
    const roi = (profit / params.buyPrice) * 100;

    const prompt = `
      Analyze this LEGO arbitrage deal:
      Buy Price: ${params.buyPrice} UAH
      Sell Price: ${params.sellPrice} UAH
      Market Floor: ${params.marketFloor || 'Unknown'}
      Market Average: ${params.marketAverage || 'Unknown'}
      Calculated ROI: ${roi.toFixed(2)}%
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'deal_analysis',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                verdict: { type: 'string' },
                roi: { type: 'number' },
                reasons: { type: 'array', items: { type: 'string' } }
              },
              required: ['verdict', 'roi', 'reasons'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      return JSON.parse(content || '{}');
    } catch (error) {
      this.logger.error('Failed to explain deal via AI', error);
      return {
        verdict: 'System Error',
        roi: Number(roi.toFixed(2)),
        reasons: ['AI service unavailable', 'Rely on manual calculation'],
      };
    }
  }

  async generateDailyPlan(): Promise<any[]> {
    const execution = await this.prisma.$queryRaw`
      SELECT 
        (SELECT COUNT(*) FROM "PurchaseFlowItem" WHERE status = 'pending') as "purchasePending",
        (SELECT COUNT(*) FROM "RepriceFlowItem" WHERE status = 'pending') as "repricePending",
        (SELECT COUNT(*) FROM "ReviewFlowItem" WHERE status = 'pending') as "reviewPending",
        (SELECT COUNT(*) FROM "Deal" WHERE status = 'open' AND score >= 80) as "hotDeals"
    `;

    const stats = (execution as any[])[0] || { purchasePending: 0, repricePending: 0, reviewPending: 0, hotDeals: 0 };

    const prompt = `
      You are the chief operations AI for Arcturus, a high-volume LEGO trading firm.
      Current Queue Status:
      - Pending Purchases: ${stats.purchasePending}
      - Pending Reprices: ${stats.repricePending}
      - Pending Reviews: ${stats.reviewPending}
      - Hot Arbitrage Deals: ${stats.hotDeals}

      Prioritize Hot Deals > Pending Purchases > Reprices > Reviews.
    `;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'daily_plan',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                tasks: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      order: { type: 'number' },
                      type: { type: 'string', enum: ['warning', 'info', 'success'] },
                      title: { type: 'string' },
                      reason: { type: 'string' }
                    },
                    required: ['order', 'type', 'title', 'reason'],
                    additionalProperties: false
                  }
                }
              },
              required: ['tasks'],
              additionalProperties: false
            }
          }
        },
        temperature: 0.1,
      });

      const content = response.choices[0].message.content;
      const parsed = JSON.parse(content || '{"tasks":[]}');
      return parsed.tasks;
    } catch (error) {
      return [
        { order: 1, type: 'warning', title: 'Manual Ops Required', reason: 'AI offline. Clear all pending queues manually.' }
      ];
    }
  }
}