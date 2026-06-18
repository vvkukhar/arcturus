import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class OpenAiService {
  private openai: OpenAI;
  private readonly logger = new Logger(OpenAiService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || 'unconfigured_key_fallback',
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
        model: process.env.OPENAI_MODEL || 'gpt-4o',
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

      let content = response.choices[0].message.content || '{}';
      content = content.replace(/^```json\n?/i, '').replace(/```$/i, '').trim();

      return JSON.parse(content);
    } catch (e: any) {
      this.logger.error(`AI Analysis failed: ${e.message}`);
      return null;
    }
  }

  async generateNegotiationScript(data: {
    title: string;
    currentPrice: number;
    targetPrice: number;
    condition: string;
  }) {
    try {
      const prompt = `
        Ти — професійний байєр, який купує набори LEGO на платформі OLX (Україна). 
        Твоя мета: ввічливо, коротко та аргументовано збити ціну, щоб продавець погодився на швидку угоду.
        
        Дані лістингу:
        - Назва: ${data.title}
        - Ціна продавця: ${data.currentPrice} UAH
        - Твоя цільова ціна: ${data.targetPrice} UAH
        - Стан: ${data.condition}
        
        Напиши 1 варіант повідомлення для продавця українською мовою. 
        Використовуй психологію: запропонуй швидку оплату або те, що забереш "сьогодні ж" через Укрпошту без зайвих питань, якщо він погодиться на твою ціну. 
        Без привітань типу "Шановний/а", просто як жива людина в чаті.
      `;

      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      return { script: response.choices[0].message.content?.trim() };
    } catch (e: any) {
      this.logger.error(`AI Negotiation Script failed: ${e.message}`);
      return { script: `Вітаю! Готовий забрати "${data.title}" за ${data.targetPrice} грн хоч сьогодні через Укрпошту. Що скажете?` }; // Fallback
    }
  }
  
  async generateMarketInsight(recentTrends: any) {
    try {
      const response = await this.openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o',
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