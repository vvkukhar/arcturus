import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class VaultService {
  private readonly monoToken = process.env.MONOBANK_TOKEN;
  private readonly apiUrl = process.env.API_BASE || 'https://arcturus-api-idsb.onrender.com/api/v1';

  constructor(private readonly prisma: PrismaService) {}

  private getStoreUrl(): string {
    const url = process.env.PUBLIC_STORE_BASE_URL;
    return url && url !== 'undefined' ? url : 'https://www.arcturusbuild.com';
  }

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { vaultBalance: true }
    });
    return user?.vaultBalance || 0;
  }

  async getInvestorPortfolio(userId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { investorId: userId },
      include: { item: true, sales: true }
    });
  }

  async createDepositLink(userId: string, amount: number) {
    const amountKopecks = toMoney(amount) * 100;
    const reference = `vault_${userId}_${Date.now()}`;
    const storeUrl = this.getStoreUrl();

    // Якщо немає токена Монобанку в .env — імітуємо платіж 
    if (!this.monoToken || this.monoToken === '') {
       console.warn('[VaultService] MONOBANK_TOKEN is missing. Emulating payment success.');
       await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { vaultBalance: { increment: amount } }
        }),
        this.prisma.vaultTransaction.create({
          data: { userId, amount: amount, type: 'deposit', description: 'Simulated Local Deposit' }
        })
       ]);
       return { url: `${storeUrl}/vault?success=true` };
    }

    const response = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Token': this.monoToken },
      body: JSON.stringify({
        amount: amountKopecks,
        ccy: 980,
        reference,
        redirectUrl: `${storeUrl}/vault`,
        webHookUrl: `${this.apiUrl}/vault/webhook`,
        merchantPaymInfo: { reference, destination: 'Deposit to Arcturus Vault' }
      }),
    });

    if (!response.ok) throw new BadRequestException('Payment gateway error');
    const data = await response.json();
    return { url: (data as any).pageUrl };
  }

  async handleDepositWebhook(body: any) {
    if (body.status === 'success' && body.reference?.startsWith('vault_')) {
      const userId = body.reference.split('_')[1];
      const amountUah = body.amount / 100;

      await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: userId },
          data: { vaultBalance: { increment: amountUah } }
        }),
        this.prisma.vaultTransaction.create({
          data: { userId, amount: amountUah, type: 'deposit', description: 'Monobank Deposit' }
        })
      ]);
    }
    return { received: true };
  }

  async investInDeal(userId: string, dealId: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id: dealId, status: 'open' },
      include: { listing: true, watchlistItem: true }
    });

    if (!deal) throw new NotFoundException('Deal not found or already closed');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.vaultBalance < deal.buyPrice) {
      throw new BadRequestException('Insufficient Vault balance');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: userId },
        data: { vaultBalance: { decrement: deal.buyPrice } }
      });

      await tx.vaultTransaction.create({
        data: { userId, amount: -deal.buyPrice, type: 'investment', description: `Funded deal: ${deal.watchlistItem.titleSnapshot}` }
      });

      await tx.deal.update({
        where: { id: dealId },
        data: { status: 'funded' }
      });

      const inv = await tx.inventoryItem.create({
        data: {
          itemId: deal.watchlistItem.itemId,
          titleSnapshot: deal.watchlistItem.titleSnapshot,
          purchasePrice: deal.buyPrice,
          totalCost: deal.buyPrice,
          expectedSalePriceManual: deal.targetSellPrice,
          quantity: 1,
          condition: 'used',
          investorId: userId,
          investorProfitShare: 0.8,
          notes: 'Funded via Arcturus Vault',
        }
      });

      await tx.purchaseOrder.create({
        data: {
          itemId: deal.watchlistItem.itemId,
          watchlistItemId: deal.watchlistItemId,
          inventoryItemId: inv.id,
          titleSnapshot: deal.watchlistItem.titleSnapshot,
          status: 'ordered',
          plannedPrice: deal.buyPrice,
          actualPrice: deal.buyPrice,
          totalCost: deal.buyPrice,
          notes: 'Auto-ordered via Vault Investor',
        }
      });

      return inv;
    });
  }
}