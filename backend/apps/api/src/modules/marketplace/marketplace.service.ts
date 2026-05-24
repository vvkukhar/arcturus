import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class MarketplaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService
  ) {}

  async submitApplication(dto: { itemId: string; expectedPrice: number; sellerId: string; notes?: string; tradeType: 'c2c' | 'c2b' }) {
    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Catalog item not found');

    const expectedPrice = Number(dto.expectedPrice);
    const commissionRate = dto.tradeType === 'c2c' ? 5.0 : 0;
    const initialStatus = dto.tradeType === 'c2b' ? 'pending_buyout' : 'pending';

    return this.prisma.inventoryItem.create({
      data: {
        itemId: dto.itemId,
        titleSnapshot: item.title,
        purchasePrice: 0,
        totalCost: 0,
        quantity: 1,
        condition: 'used',
        expectedSalePriceManual: expectedPrice,
        isMarketplace: true,
        approvalStatus: initialStatus,
        sellerId: dto.sellerId,
        commissionRate,
        sellerPayout: dto.tradeType === 'c2c' ? expectedPrice * 0.95 : expectedPrice,
        notes: `[${dto.tradeType.toUpperCase()}] ${dto.notes || ''}`,
      },
    });
  }

  async uploadImages(inventoryItemId: string, sellerId: string, files: Express.Multer.File[]) {
    const item = await this.prisma.inventoryItem.findUnique({ where: { id: inventoryItemId } });
    
    if (!item) throw new NotFoundException('Listing not found');
    if (item.sellerId !== sellerId) throw new ForbiddenException('Not your listing');
    if (!files || files.length === 0) throw new BadRequestException('No files provided');

    const uploaded = [];
    for (const file of files) {
      const result = await this.mediaService.addInventoryImage({
        inventoryItemId,
        file: { buffer: file.buffer, mimetype: file.mimetype },
      });
      uploaded.push(result);
    }
    
    return uploaded;
  }

  async getMyListings(sellerId: string) {
    return this.prisma.inventoryItem.findMany({
      where: { isMarketplace: true, sellerId },
      include: { item: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPendingQueue() {
    return this.prisma.inventoryItem.findMany({
      where: { 
        isMarketplace: true, 
        approvalStatus: { in: ['pending', 'pending_buyout'] } 
      },
      include: { item: true, seller: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveListing(inventoryItemId: string) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId }
    });

    if (!item) throw new NotFoundException('Listing not found');

    return this.prisma.$transaction(async (tx) => {
      // ЛОГІКА C2B (ШВИДКИЙ ВИКУП)
      if (item.approvalStatus === 'pending_buyout') {
        const updatedItem = await tx.inventoryItem.update({
          where: { id: inventoryItemId },
          data: {
            approvalStatus: 'approved',
            isMarketplace: false, 
            purchasePrice: item.sellerPayout || item.expectedSalePriceManual || 0,
            totalCost: item.sellerPayout || item.expectedSalePriceManual || 0,
            expectedSalePriceManual: null, 
            sellerId: null, 
            notes: `${item.notes || ''} [C2B Processed]`.trim(),
          },
        });

        await tx.expense.create({
          data: {
            type: 'procurement',
            category: 'c2b_buyout',
            amount: toMoney(item.sellerPayout || item.expectedSalePriceManual || 0),
            inventoryItemId: item.id,
            description: `C2B Buyout for ${item.titleSnapshot}`,
          }
        });

        await tx.repriceFlowItem.create({
          data: {
            inventoryItemId: item.id,
            currentPrice: updatedItem.totalCost,
            status: 'pending',
            reason: 'Auto-reprice after C2B Buyout',
          }
        });

        return updatedItem;
      } 
      
      // ЛОГІКА C2C (МАРКЕТПЛЕЙС)
      return tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { approvalStatus: 'approved' },
      });
    });
  }

  async rejectListing(inventoryItemId: string, reason?: string) {
    return this.prisma.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { approvalStatus: 'rejected', quantity: 0, notes: reason },
    });
  }

  async getSellerFinance(sellerId: string) {
    // Всі продажі користувача як стороннього селера
    const sales = await this.prisma.sale.findMany({
      where: { isMarketplaceSale: true, inventoryItem: { sellerId } },
    });

    // Всі запити на виведення коштів
    const payoutRequests = await this.prisma.payoutRequest.findMany({
      where: { sellerId },
      orderBy: { createdAt: 'desc' },
    });

    const totalEarned = sales.reduce((sum, s) => sum + Number(s.sellerPayout || 0), 0);
    const totalPaid = payoutRequests.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount), 0);
    const processingAmount = payoutRequests.filter(p => p.status === 'pending' || p.status === 'processing').reduce((sum, p) => sum + Number(p.amount), 0);
    
    const availableBalance = Math.max(0, toMoney(totalEarned - totalPaid - processingAmount));

    return {
      availableBalance,
      processingAmount,
      totalEarned,
      payoutRequests,
    };
  }

  async requestPayout(sellerId: string, amount: number, cardData: string) {
    const finance = await this.getSellerFinance(sellerId);
    const cleanAmount = toMoney(amount);

    if (cleanAmount <= 0 || cleanAmount > finance.availableBalance) {
      throw new BadRequestException('Insufficient available balance or invalid amount');
    }

    if (!cardData || cardData.replace(/\s/g, '').length < 16) {
      throw new BadRequestException('Invalid credit card format');
    }

    return this.prisma.payoutRequest.create({
      data: {
        sellerId,
        amount: cleanAmount,
        cardData: cardData.replace(/\s/g, ''),
        status: 'pending',
      },
    });
  }
}