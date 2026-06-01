import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyndicateService {
  constructor(private readonly prisma: PrismaService) {}

  async generateReferralCode(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.referralCode) return { code: user.referralCode };

    const prefix = user?.name ? user.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) : 'ARC';
    const code = `${prefix}${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    await this.prisma.user.update({
      where: { id: userId },
      data: { referralCode: code }
    });

    return { code };
  }

  async applyReferralCode(newUserId: string, code: string) {
    const referrer = await this.prisma.user.findUnique({ where: { referralCode: code } });
    if (!referrer) throw new NotFoundException('Invalid referral code');
    if (referrer.id === newUserId) throw new BadRequestException('Cannot use your own code');

    const me = await this.prisma.user.findUnique({ where: { id: newUserId } });
    if (me?.referredById) throw new BadRequestException('You were already referred');

    await this.prisma.user.update({
      where: { id: newUserId },
      data: { referredById: referrer.id }
    });

    return { success: true };
  }

  async getAffiliateDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        referredUsers: { select: { id: true, name: true, createdAt: true } },
        affiliateRewards: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });

    if (!user) throw new NotFoundException('User not found');

    const totalAC = user.affiliateRewards.reduce((sum, r) => sum + r.amount, 0);

    return {
      referralCode: user.referralCode,
      totalEarnedAC: totalAC,
      currentPoints: user.points,
      referralsCount: user.referredUsers.length,
      referrals: user.referredUsers,
      rewards: user.affiliateRewards
    };
  }

  async processVaultSuccessFeeCommission(vaultUserId: string, successFeeAmountUAH: number) {
    const investor = await this.prisma.user.findUnique({ where: { id: vaultUserId } });
    if (!investor?.referredById || successFeeAmountUAH <= 0) return;

    // 1 UAH success fee = 10 AC for referrer
    const pointsReward = Math.round(successFeeAmountUAH * 10); 

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: investor.referredById! },
        data: { points: { increment: pointsReward } }
      });

      await tx.affiliateReward.create({
        data: {
          userId: investor.referredById!,
          sourceId: vaultUserId,
          sourceType: 'vault_success_fee',
          amount: pointsReward,
          status: 'credited'
        }
      });
      
      await tx.pointTransaction.create({
        data: {
          userId: investor.referredById!,
          amount: pointsReward,
          type: 'earn',
          description: 'Syndicate Network Yield (Vault)'
        }
      });
    });
  }

  async processMarketplaceSaleCommission(sellerId: string, commissionAmountUAH: number) {
    const seller = await this.prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller?.referredById || commissionAmountUAH <= 0) return;

    // 1 UAH commission = 20 AC for referrer
    const pointsReward = Math.round(commissionAmountUAH * 20);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: seller.referredById! },
        data: { points: { increment: pointsReward } }
      });

      await tx.affiliateReward.create({
        data: {
          userId: seller.referredById!,
          sourceId: sellerId,
          sourceType: 'marketplace_fee',
          amount: pointsReward,
          status: 'credited'
        }
      });
      
      await tx.pointTransaction.create({
        data: {
          userId: seller.referredById!,
          amount: pointsReward,
          type: 'earn',
          description: 'Syndicate Network Yield (Marketplace)'
        }
      });
    });
  }
}