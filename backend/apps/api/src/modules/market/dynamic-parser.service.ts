import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface MarketRules {
  conditionMultiplier: Record<string, number>;
  minMargin: number;
  maxVolatility: number;
}

@Injectable()
export class DynamicParserService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly NicheRules: Record<string, MarketRules> = {
    watches: {
      conditionMultiplier: { new: 1.0, mint: 0.95, used: 0.75 },
      minMargin: 500,
      maxVolatility: 0.15,
    },
    cards: {
      conditionMultiplier: { PSA10: 1.0, PSA9: 0.7, Raw: 0.3 },
      minMargin: 50,
      maxVolatility: 0.5,
    },
    toys: {
      conditionMultiplier: { sealed: 1.0, used: 0.6, missing_parts: 0.3 },
      minMargin: 150,
      maxVolatility: 0.3,
    }
  };

  getRules(niche: string): MarketRules {
    return this.NicheRules[niche] || this.NicheRules['toys'];
  }

  async adaptContext(niche: string) {
    const rules = this.getRules(niche);
    return {
      niche,
      rules,
      status: 'ready'
    };
  }
}