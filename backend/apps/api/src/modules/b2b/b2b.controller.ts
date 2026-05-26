import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { B2bGuard } from './b2b.guard';

@UseGuards(B2bGuard)
@Controller('v1/b2b')
export class B2bController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('market')
  async getMarketData(@Query('setNumber') setNumber: string) {
    if (!setNumber) return { error: 'setNumber required' };
    
    const item = await this.prisma.item.findFirst({
      where: { setNumber },
      include: {
        marketSnapshots: { orderBy: { computedAt: 'desc' }, take: 1 },
        soldComps: { orderBy: { soldAt: 'desc' }, take: 10 }
      }
    });

    if (!item) return { data: null };

    return {
      setNumber: item.setNumber,
      title: item.title,
      snapshot: item.marketSnapshots[0] || null,
      recentSales: item.soldComps.map(c => ({ price: c.soldPrice, date: c.soldAt, source: c.sourceCode }))
    };
  }

  @Get('deals')
  async getLiveDeals(@Req() req: any, @Query('limit') limit: string) {
    const take = limit ? Math.min(Number(limit), 100) : 50;
    
    // Впроваджуємо "Data Lag" (Затримку). Віддаємо тільки ті угоди, які висять вже 15 хвилин 
    // і які ми самі не захотіли забирати.
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    const deals = await this.prisma.deal.findMany({
      where: { 
        status: 'open',
        createdAt: { lt: fifteenMinsAgo },
        roiPercent: { lt: 35 } // Найжирніші угоди залишаємо собі
      },
      include: {
        listing: { select: { url: true, price: true, sourceCode: true } },
        watchlistItem: { select: { titleSnapshot: true } }
      },
      orderBy: { score: 'desc' },
      take
    });

    return deals.map(d => ({
      title: d.watchlistItem.titleSnapshot,
      buyPrice: d.buyPrice,
      targetSellPrice: d.targetSellPrice,
      profit: d.profit,
      roi: d.roiPercent,
      source: d.listing.sourceCode,
      url: d.listing.url
    }));
  }
}