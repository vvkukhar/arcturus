import { BadRequestException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';

@Injectable()
export class OffersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly realtime: RealtimeGateway,
  ) {}

  async createOffer(buyerId: string, dto: { inventoryItemId: string; amount: number; message?: string }) {
    const item = await this.prisma.inventoryItem.findUnique({
      where: { id: dto.inventoryItemId },
      include: { item: true }
    });

    if (!item) throw new NotFoundException('Item not found');
    if (item.sellerId === buyerId) throw new BadRequestException('You cannot make an offer on your own item');
    if (item.quantity < 1) throw new BadRequestException('Item is out of stock');

    const offer = await this.prisma.offer.create({
      data: {
        inventoryItemId: dto.inventoryItemId,
        buyerId,
        amount: dto.amount,
        message: dto.message,
      },
      include: { inventoryItem: { include: { item: true } }, buyer: true }
    });

    // Сповіщаємо власника товару (селера або адміна)
    if (item.sellerId) {
      await this.notifications.create({
        title: 'New Offer Received!',
        message: `${offer.buyer.name} offered ${dto.amount} UAH for ${item.titleSnapshot}`,
        type: 'offer',
        targetUserId: item.sellerId,
      });
    }

    this.realtime.emitDashboardRefresh('offer_created');
    return offer;
  }

  async getMyOffers(userId: string) {
    return this.prisma.offer.findMany({
      where: { buyerId: userId },
      include: { inventoryItem: { include: { item: true, images: { take: 1 } } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getOffersForMyItems(sellerId: string) {
    return this.prisma.offer.findMany({
      where: { inventoryItem: { sellerId, isMarketplace: true }, status: 'pending' },
      include: { inventoryItem: { include: { item: true } }, buyer: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async respondToOffer(userId: string, offerId: string, action: 'accept' | 'reject') {
    const offer = await this.prisma.offer.findUnique({
      where: { id: offerId },
      include: { inventoryItem: true }
    });

    if (!offer) throw new NotFoundException('Offer not found');
    
    // Перевірка прав (має бути власником товару або адміном)
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const isAdmin = user?.role === 'admin' || user?.role === 'operator';
    if (offer.inventoryItem.sellerId !== userId && !isAdmin) {
      throw new ForbiddenException('Not authorized to respond to this offer');
    }

    const updatedOffer = await this.prisma.offer.update({
      where: { id: offerId },
      data: { status: action === 'accept' ? 'accepted' : 'rejected' }
    });

    // Сповіщаємо покупця про рішення
    await this.notifications.create({
      title: action === 'accept' ? 'Offer Accepted! 🎉' : 'Offer Rejected',
      message: `Your offer of ${offer.amount} UAH for ${offer.inventoryItem.titleSnapshot} was ${action}ed.`,
      type: 'offer_response',
      targetUserId: offer.buyerId,
    });

    if (action === 'accept') {
       // Логіка створення замовлення може бути тут, або покупець переходить в чекаут
    }

    this.realtime.emitDashboardRefresh('offer_responded');
    return updatedOffer;
  }
}