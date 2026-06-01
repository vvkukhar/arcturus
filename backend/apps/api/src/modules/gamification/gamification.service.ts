import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class GamificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async awardPoints(userId: string, amount: number, description: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: amount } },
      });

      await tx.pointTransaction.create({
        data: {
          userId,
          amount,
          type: 'earn',
          description,
        },
      });

      this.realtime.emitCustom(`user.${userId}.points_updated`, {
        amount,
        description,
        timestamp: new Date(),
      });

      return { success: true };
    });
  }

  async getLeaderboard(limit: number = 10) {
    const users = await this.prisma.user.findMany({
      where: { points: { gt: 0 } },
      select: {
        id: true,
        name: true,
        points: true,
        scoutLeads: {
          select: { status: true }
        }
      },
      orderBy: { points: 'desc' },
      take: limit,
    });

    return users.map(user => {
      let rank = 'Rookie';
      if (user.points >= 10000) rank = 'Grandmaster';
      else if (user.points >= 5000) rank = 'Master Scout';
      else if (user.points >= 1000) rank = 'Hunter';

      const successfulLeads = user.scoutLeads.filter(l => l.status === 'bought').length;

      return {
        id: user.id,
        name: user.name,
        points: user.points,
        rank,
        successfulLeads,
        totalLeads: user.scoutLeads.length
      };
    });
  }

  async getMyRewards(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        promoCodes: {
          where: { isUsed: false, validUntil: { gt: new Date() } },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) throw new BadRequestException('User not found');

    let rank = 'Rookie';
    let nextRankPoints = 1000;
    if (user.points >= 10000) { rank = 'Grandmaster'; nextRankPoints = user.points; }
    else if (user.points >= 5000) { rank = 'Master Scout'; nextRankPoints = 10000; }
    else if (user.points >= 1000) { rank = 'Hunter'; nextRankPoints = 5000; }

    return {
      points: user.points,
      rank,
      nextRankPoints,
      promoCodes: user.promoCodes
    };
  }

  async buyPromoCode(userId: string, discountPercent: number) {
    const costs: Record<number, number> = { 5: 5000, 10: 12000, 15: 25000 };
    const cost = costs[discountPercent];

    if (!cost) throw new BadRequestException('Invalid discount tier');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.points < cost) {
      throw new BadRequestException('Not enough Arcturus Credits (AC)');
    }

    const code = `ARC-${discountPercent}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30); 

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { points: { decrement: cost } }
      });

      await tx.pointTransaction.create({
        data: {
          userId,
          amount: -cost,
          type: 'spend',
          description: `Purchased ${discountPercent}% discount promo code`
        }
      });

      const promo = await tx.promoCode.create({
        data: {
          code,
          discountPercent,
          userId,
          validUntil
        }
      });

      return promo;
    });
  }
}