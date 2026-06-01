import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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

  async getActiveSurges() {
    return this.prisma.scoutSurge.findMany({
      where: { expiresAt: { gt: new Date() } },
      include: { item: true },
      orderBy: { multiplier: 'desc' }
    });
  }

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

  async approveLead(leadId: string, baseRewardAC: number) {
    const lead = await this.prisma.scoutLead.findUnique({ where: { id: leadId } });
    if (!lead) throw new NotFoundException('Lead not found');

    const activeSurges = await this.prisma.scoutSurge.findMany({
      where: { expiresAt: { gt: new Date() } }
    });

    let bestMultiplier = 1.0;
    for (const surge of activeSurges) {
      if (lead.notes?.toLowerCase().includes(String(surge.theme).toLowerCase()) || 
          lead.url.includes(String(surge.itemId))) {
        if (surge.multiplier > bestMultiplier) {
          bestMultiplier = surge.multiplier;
        }
      }
    }

    const finalReward = Math.round(baseRewardAC * bestMultiplier);

    return this.prisma.$transaction(async (tx) => {
      const updatedLead = await tx.scoutLead.update({
        where: { id: leadId },
        data: { status: 'bought', reward: finalReward }
      });

      await tx.user.update({
        where: { id: lead.scoutId },
        data: { points: { increment: finalReward } }
      });

      await tx.pointTransaction.create({
        data: {
          userId: lead.scoutId,
          amount: finalReward,
          type: 'earn',
          description: `Bounty for lead ${leadId} (x${bestMultiplier} multiplier)`
        }
      });

      return updatedLead;
    });
  }
}