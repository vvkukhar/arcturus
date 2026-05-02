import { Injectable } from '@nestjs/common';
import { toMoney } from '../../common/money.utils';
import { NotificationsService } from '../notifications/notifications.service';
import { PricingService } from '../pricing/pricing.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuggestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pricing: PricingService,
    private readonly notifications: NotificationsService,
  ) {}

  async getBuySuggestions(): Promise<unknown[]> {
    const watchlist = await this.prisma.watchlistItem.findMany({
      include: {
        item: true,
      },
    });

    const result = watchlist.map((item) => {
      const buyPrice = toMoney(item.maxBuyPrice);
      const sellPrice = toMoney(item.targetSellPrice ?? 0);

      const roi = this.pricing.calculateROI({
        buyPrice,
        sellPrice,
      });

      const action =
        roi > 50
          ? 'BUY NOW'
          : roi > 30
            ? 'GOOD DEAL'
            : 'SKIP';

      return {
        id: item.id,
        itemId: item.itemId,
        title: item.titleSnapshot,
        setNumber: item.item?.setNumber ?? null,
        buyPrice,
        sellPrice,
        roi,
        action,
      };
    });

    const best = result.find((item) => item.action === 'BUY NOW');

    if (best) {
      await this.notifications.createDealNotification({
        itemTitle: best.title,
        roi: best.roi,
        action: best.action,
      });
    }

    return result;
  }

  async getSellSuggestions(): Promise<unknown[]> {
    const inventory = await this.prisma.inventoryItem.findMany({
      include: {
        item: true,
      },
    });

    return inventory.map((item) => {
      const buyPrice = toMoney(item.totalCost);
      const sellPrice = toMoney(item.expectedSalePriceManual ?? 0);

      const roi = this.pricing.calculateROI({
        buyPrice,
        sellPrice,
      });

      return {
        id: item.id,
        itemId: item.itemId,
        title: item.titleSnapshot,
        setNumber: item.item?.setNumber ?? null,
        buyPrice,
        sellPrice,
        roi,
        action:
          roi > 60
            ? 'SELL NOW'
            : roi > 30
              ? 'LIST'
              : 'HOLD',
      };
    });
  }
}