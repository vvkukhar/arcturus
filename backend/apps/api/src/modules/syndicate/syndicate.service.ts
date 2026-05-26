import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '@arcturus/shared';

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

    const pendingPayouts = await this.prisma.payoutRequest.aggregate({
      where: { sellerId: userId, adminNote: { contains: 'Affiliate' }, status: 'pending' },
      _sum: { amount: true }
    });

    return {
      referralCode: user.referralCode,
      balance: user.affiliateBalance,
      pendingPayout: pendingPayouts._sum.amount || 0,
      referralsCount: user.referredUsers.length,
      referrals: user.referredUsers,
      rewards: user.affiliateRewards
    };
  }

  async processSaleCommission(saleId: string) {
    const sale = await this.prisma.sale.findUnique({
      where: { id: saleId },
      include: { 
        orders: { include: { reserveRequest: true } }
      }
    });

    if (!sale) return;

    let buyerUserId = null;
    if (sale.orders.length > 0 && sale.orders[0].reserveRequest?.name) {
       // Logic to map order to user if we eventually link user ids to orders.
       // For now, Syndicate works best with Vault investments where we have absolute user mapping.
    }

    return true; 
  }

  async processVaultSuccessFeeCommission(vaultUserId: string, successFeeAmount: number) {
    const investor = await this.prisma.user.findUnique({ where: { id: vaultUserId } });
    if (!investor?.referredById || successFeeAmount <= 0) return;

    const cashback = toMoney(successFeeAmount * 0.05); // 5% of Arcturus success fee goes to the referrer

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: investor.referredById! },
        data: { affiliateBalance: { increment: cashback } }
      });

      await tx.affiliateReward.create({
        data: {
          userId: investor.referredById!,
          sourceId: vaultUserId,
          sourceType: 'vault_success_fee',
          amount: cashback,
          status: 'credited'
        }
      });
    });
  }

  async processMarketplaceSaleCommission(sellerId: string, commissionAmount: number) {
    const seller = await this.prisma.user.findUnique({ where: { id: sellerId } });
    if (!seller?.referredById || commissionAmount <= 0) return;

    const cashback = toMoney(commissionAmount * 0.10); // 10% of Arcturus marketplace fee

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: seller.referredById! },
        data: { affiliateBalance: { increment: cashback } }
      });

      await tx.affiliateReward.create({
        data: {
          userId: seller.referredById!,
          sourceId: sellerId,
          sourceType: 'marketplace_fee',
          amount: cashback,
          status: 'credited'
        }
      });
    });
  }

  async requestAffiliatePayout(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.affiliateBalance < 100) {
      throw new BadRequestException('Minimum payout is 100 UAH');
    }

    if (!user.payoutCard) throw new BadRequestException('Please set a payout card in settings');

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { affiliateBalance: 0 }
      });

      return tx.payoutRequest.create({
        data: {
          sellerId: userId,
          amount: user.affiliateBalance,
          status: 'pending',
          cardData: user.payoutCard,
          adminNote: 'Affiliate Program Payout'
        }
      });
    });
  }

  async getPendingAffiliatePayouts() {
    return this.prisma.payoutRequest.findMany({
      where: { status: 'pending', adminNote: { contains: 'Affiliate' } },
      include: { seller: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async approvePayout(id: string) {
    return this.prisma.payoutRequest.update({
      where: { id },
      data: { status: 'paid', updatedAt: new Date() }
    });
  }
}