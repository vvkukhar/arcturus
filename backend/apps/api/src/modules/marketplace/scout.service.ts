import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class ScoutService {
  constructor(private readonly prisma: PrismaService) {}

  async submitLead(scoutId: string, url: string, notes?: string) {
    const cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      throw new BadRequestException('Invalid URL format');
    }

    const existing = await this.prisma.scoutLead.findFirst({
      where: { url: cleanUrl }
    });

    if (existing) {
      throw new BadRequestException('Цей лінк вже був запропонований іншим скаутом.');
    }

    return this.prisma.scoutLead.create({
      data: {
        scoutId,
        url: cleanUrl,
        notes,
        status: 'pending'
      }
    });
  }

  async getMyLeads(scoutId: string) {
    return this.prisma.scoutLead.findMany({
      where: { scoutId },
      orderBy: { createdAt: 'desc' }
    });
  }

  // --- Методи для адмінки ---

  async getAllLeads() {
    return this.prisma.scoutLead.findMany({
      include: { scout: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async rejectLead(leadId: string, adminNote?: string) {
    return this.prisma.scoutLead.update({
      where: { id: leadId },
      data: { status: 'rejected', adminNote }
    });
  }

  async approveAndRewardLead(leadId: string, rewardAmount: number) {
    const lead = await this.prisma.scoutLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const amount = toMoney(rewardAmount);

    return this.prisma.$transaction(async (tx) => {
      // 1. Оновлюємо статус ліда
      const updatedLead = await tx.scoutLead.update({
        where: { id: leadId },
        data: { status: 'bought', reward: amount }
      });

      // 2. Створюємо фіктивний айтем для нарахування на баланс, 
      // якщо його ще не існує (щоб не ламати зв'язки Sale)
      let rewardItem = await tx.inventoryItem.findFirst({ 
        where: { id: 'item_bounty_reward' } 
      });

      if (!rewardItem) {
        rewardItem = await tx.inventoryItem.create({
          data: {
            id: 'item_bounty_reward',
            itemId: 'item_unresolved_placeholder', // Базовий ID
            titleSnapshot: 'Bounty Reward System Item',
            purchasePrice: 0,
            totalCost: 0,
            quantity: 99999,
            isMarketplace: true,
            sellerId: lead.scoutId // Прив'язуємо до скаута
          }
        });
      }

      // 3. Створюємо фіктивний продаж для балансу
      await tx.sale.create({
        data: {
          inventoryItemId: rewardItem.id,
          itemId: rewardItem.itemId,
          quantity: 1,
          sellPrice: amount,
          costBasis: 0,
          profit: 0,
          roiPercent: 0,
          isMarketplaceSale: true,
          commissionAmount: 0,
          sellerPayout: amount,
          payoutStatus: 'pending',
          buyerName: 'Arcturus Reward System',
          notes: `Bounty Reward for Lead: ${lead.url}`,
        }
      });

      return updatedLead;
    });
  }
}