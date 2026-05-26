import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class GamificationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  // Нарахування балів за активність (для рейтингу в таблиці лідерів)
  async awardPoints(userId: string, amount: number, description: string) {
    return this.prisma.$transaction(async (tx) => {
      // Оновлюємо загальний рахунок користувача
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: amount } },
      });

      // Логуємо подію для історії (щоб адмін бачив за що бали)
      await tx.pointTransaction.create({
        data: {
          userId,
          amount,
          type: 'earn',
          description,
        },
      });

      // Сповіщаємо скаута в реальному часі
      this.realtime.emitCustom(`user.${userId}.points_updated`, {
        amount,
        description,
        timestamp: new Date(),
      });

      return { success: true };
    });
  }

  // Отримання рейтингової таблиці
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
      if (user.points >= 5000) rank = 'Master Scout';
      else if (user.points >= 1000) rank = 'Pro Hunter';

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
}