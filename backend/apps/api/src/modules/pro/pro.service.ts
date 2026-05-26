import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { toMoney } from '@arcturus/shared';
import * as crypto from 'crypto';

@Injectable()
export class ProService {
  private readonly monoToken = process.env.MONOBANK_TOKEN!;
  private readonly storeUrl = process.env.PUBLIC_STORE_BASE_URL!;
  private readonly apiUrl = process.env.API_BASE!;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  async createSubscriptionPayment(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const amountKopecks = 50000; 
    const reference = `sub_${userId}_${Date.now()}`;

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Token': this.monoToken,
      },
      body: JSON.stringify({
        amount: amountKopecks,
        ccy: 980,
        reference,
        redirectUrl: `${this.storeUrl}/pro/success`,
        webHookUrl: `${this.apiUrl}/pro/webhook`,
        merchantPaymInfo: {
          reference,
          destination: 'Підписка Arcturus PRO (1 місяць)',
          basketOrder: [{ name: 'Arcturus PRO', qty: 1, sum: amountKopecks, total: amountKopecks }]
        }
      }),
    });

    if (!response.ok) throw new BadRequestException('Payment gateway error');

    const data = await response.json();
    return { url: (data as any).pageUrl };
  }

  async handlePaymentWebhook(body: any, signature: string) {
    if (body.status === 'success' && body.reference?.startsWith('sub_')) {
      const userId = body.reference.split('_')[1];
      
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await this.prisma.user.update({
        where: { id: userId },
        data: { isPro: true, proExpiresAt: expiresAt }
      });
      
      const pipeline = this.redis.getClient().pipeline();
      const sessions = await this.prisma.userSession.findMany({ where: { userId } });
      for (const s of sessions) pipeline.del(`session:${s.tokenHash}`);
      await pipeline.exec();
    }
    return { received: true };
  }

  async getDeals(user: any) {
    const isAdmin = user.role === 'admin' || user.role === 'operator';
    
    let whereClause: any = { status: 'open' };

    if (!isAdmin) {
      const delayTime = new Date(Date.now() - 15 * 60 * 1000);
      whereClause = {
        status: 'open',
        roiPercent: { lt: 35 }, 
        createdAt: { lt: delayTime } 
      };
    }

    const deals = await this.prisma.deal.findMany({
      where: whereClause,
      include: {
        listing: { include: { source: true } },
        watchlistItem: { include: { item: true } }
      },
      orderBy: { score: 'desc' },
      take: 100
    });

    return deals.map(d => ({
      id: d.id,
      title: d.watchlistItem.titleSnapshot,
      buyPrice: d.buyPrice,
      targetSellPrice: d.targetSellPrice,
      profit: d.profit,
      roiPercent: d.roiPercent,
      url: d.listing.url,
      sourceCode: d.listing.sourceCode,
      score: d.score,
      imageUrl: d.listing.imageUrl
    }));
  }

  async getScreenerData(user: any) {
    const isAdmin = user.role === 'admin' || user.role === 'operator';
    const inventory = await this.prisma.inventoryItem.findMany({
      where: { quantity: { gt: 0 } },
      include: { item: true },
      orderBy: { createdAt: 'desc' },
      take: 500
    });

    return inventory.map(item => {
      const cost = item.totalCost || 1;
      const target = item.expectedSalePriceManual ?? cost;
      let roi = ((target - cost) / cost) * 100;
      
      if (!isAdmin && roi >= 40) {
        roi = 38.5 + (Math.random() * 1.4); 
      }

      return {
        id: item.id,
        itemId: item.itemId,
        titleSnapshot: item.titleSnapshot,
        totalCost: isAdmin ? item.totalCost : null, 
        expectedSalePriceManual: item.expectedSalePriceManual,
        roiPercent: toMoney(roi),
        item: { theme: item.item.theme, setNumber: item.item.setNumber }
      };
    });
  }
}