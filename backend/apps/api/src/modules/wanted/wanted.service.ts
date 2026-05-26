import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { toMoney } from '@arcturus/shared';

@Injectable()
export class WantedService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async addToWanted(userId: string, dto: { itemId: string; maxPrice?: number }) {
    const item = await this.prisma.item.findUnique({ where: { id: dto.itemId } });
    if (!item) throw new NotFoundException('Товар не знайдено в загальному каталозі');

    return this.prisma.wantedItem.create({
      data: {
        userId,
        itemId: dto.itemId,
        maxPrice: dto.maxPrice ? Number(dto.maxPrice) : null,
      },
      include: { item: true },
    });
  }

  async checkAndNotify(inventoryItemId: string) {
    const target = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { item: true },
    });

    if (!target || !target.isMarketplace || target.approvalStatus !== 'approved') return;

    const price = target.expectedSalePriceManual ?? target.purchasePrice;

    const matches = await this.prisma.wantedItem.findMany({
      where: {
        itemId: target.itemId,
        active: true,
        OR: [
          { maxPrice: null },
          { maxPrice: { gte: price } }
        ],
      },
      include: { user: true },
    });

    for (const match of matches) {
      await this.notifications.create({
        title: 'Набір з вашого списку бажаного вже в продажу! 💥',
        message: `Лот "${target.titleSnapshot}" доступний на маркетплейсі за ${price} UAH. Встигніть купити!`,
        type: 'wanted_match',
        targetUserId: match.userId,
        payloadJson: { inventoryItemId: target.id },
      });
    }
  }

  async getMyWatchlist(userId: string) {
    return this.prisma.wantedItem.findMany({
      where: { userId, active: true },
      include: { item: true },
    });
  }

  // НОВИЙ МЕТОД: Агрегація попиту для адмінки
  async getDemandHeatmap() {
    const agg = await this.prisma.wantedItem.groupBy({
      by: ['itemId'],
      where: { active: true },
      _count: { _all: true },
      _max: { maxPrice: true },
      _avg: { maxPrice: true },
      orderBy: { _count: { itemId: 'desc' } },
      take: 50,
    });

    const itemIds = agg.map(a => a.itemId);
    
    const items = await this.prisma.item.findMany({
      where: { id: { in: itemIds } }
    });

    // Дізнаємось, чи вже є цей товар у нашому Watchlist (щоб не дублювати закупки)
    const activeWatchlist = await this.prisma.watchlistItem.findMany({
      where: { itemId: { in: itemIds }, active: true },
      select: { itemId: true, id: true }
    });
    
    const watchlistMap = new Set(activeWatchlist.map(w => w.itemId));

    return agg.map(a => {
      const item = items.find(i => i.id === a.itemId);
      const maxPrice = a._max.maxPrice ?? 0;
      // Очікуваний дохід - це середня готовність платити помножена на кількість бажаючих
      const potentialRevenue = toMoney((a._avg.maxPrice ?? 0) * a._count._all);

      return {
        itemId: a.itemId,
        title: item?.title ?? 'Unknown Item',
        setNumber: item?.setNumber ?? null,
        theme: item?.theme ?? 'Unknown',
        imageUrl: item?.imageUrl ?? null,
        demandCount: a._count._all,
        highestOffer: toMoney(maxPrice),
        averageOffer: toMoney(a._avg.maxPrice ?? 0),
        potentialRevenue,
        inProcurementWatchlist: watchlistMap.has(a.itemId)
      };
    });
  }
}