import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DynamicParserService } from '../market/dynamic-parser.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class B2BAdapterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly dynamicParser: DynamicParserService
  ) {}

  async calculateNicheOpportunity(itemId: string, niche: string, buyPrice: number) {
    const rules = this.dynamicParser.getRules(niche);
    const snapshot = await this.prisma.marketSnapshot.findFirst({
      where: { itemId },
      orderBy: { computedAt: 'desc' }
    });

    if (!snapshot || !snapshot.medianPrice) return { action: 'SKIP', score: 0 };

    const estimatedExit = toMoney(snapshot.medianPrice);
    const profit = toMoney(estimatedExit - buyPrice);
    const roi = (profit / buyPrice) * 100;

    let score = 50;
    if (roi >= 30) score += 20;
    if (profit >= rules.minMargin) score += 20;

    return {
      action: score >= 80 ? 'BUY_NOW' : score >= 60 ? 'BUY' : 'WATCH',
      score,
      profit,
      roi,
      nicheRulesApplied: niche
    };
  }
}