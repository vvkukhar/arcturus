import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { ActivityService } from '../activity/activity.service';
import { calculateProfit, calculateRoiPercent, toMoney } from '@arcturus/shared';
import { Prisma } from '@prisma/client';

@Injectable()
export class PosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
    private readonly activity: ActivityService,
  ) {}

  async findItemByBarcode(barcode: string) {
    const item = await this.prisma.inventoryItem.findFirst({
      where: {
        OR: [{ id: barcode }, { item: { setNumber: barcode } }],
        quantity: { gt: 0 }
      },
      include: {
        item: true,
        images: { orderBy: { sortOrder: 'asc' }, take: 1 }
      }
    });

    if (!item) {
      throw new NotFoundException('Item not found or out of stock');
    }

    return item;
  }

  async processCheckout(params: {
    items: { inventoryItemId: string; quantity: number; price: number }[];
    paymentMethod: 'cash' | 'card' | 'crypto';
    customerContact?: string;
  }) {
    if (!params.items || params.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    // Сортуємо ID для уникнення Deadlocks у PostgreSQL
    const sortedItems = [...params.items].sort((a, b) => 
      a.inventoryItemId.localeCompare(b.inventoryItemId)
    );

    return this.prisma.$transaction(async (tx) => {
      const sales = [];
      let totalRevenue = 0;
      let totalProfit = 0;

      for (const cartItem of sortedItems) {
        // ФІКС: Звичайний FOR UPDATE. Дозволяємо БД ставити транзакції в чергу, а не відбивати їх.
        const inventory = await tx.$queryRaw<Array<any>>`
          SELECT "id", "quantity", "totalCost", "itemId", "titleSnapshot", "warehouseId", "storageLocationId" 
          FROM "InventoryItem" 
          WHERE "id" = ${cartItem.inventoryItemId} 
          FOR UPDATE
        `;

        if (!inventory || inventory.length === 0) {
          throw new BadRequestException(`Item ${cartItem.inventoryItemId} is unavailable`);
        }

        const inv = inventory[0];

        if (inv.quantity < cartItem.quantity) {
          throw new BadRequestException(`Insufficient stock for ${inv.titleSnapshot}`);
        }

        const unitCost = inv.totalCost / inv.quantity;
        const costBasis = toMoney(unitCost * cartItem.quantity);
        const sellPrice = toMoney(cartItem.price * cartItem.quantity);
        const profit = calculateProfit({ revenue: sellPrice, cost: costBasis });
        const roiPercent = calculateRoiPercent({ profit, cost: costBasis });

        totalRevenue += sellPrice;
        totalProfit += profit;

        const sale = await tx.sale.create({
          data: {
            inventoryItemId: inv.id,
            itemId: inv.itemId,
            quantity: cartItem.quantity,
            sellPrice,
            costBasis,
            profit,
            roiPercent,
            channel: `POS_${params.paymentMethod.toUpperCase()}`,
            buyerName: 'POS Customer',
            notes: params.customerContact ? `Contact: ${params.customerContact}` : null,
          }
        });

        await tx.inventoryItem.update({
          where: { id: inv.id },
          data: { quantity: { decrement: cartItem.quantity } },
        });

        await tx.stockMovement.create({
          data: {
            inventoryItemId: inv.id,
            warehouseId: inv.warehouseId,
            fromStorageLocationId: inv.storageLocationId,
            toStorageLocationId: null,
            type: 'sale_pos',
            quantity: cartItem.quantity,
            reason: `POS Checkout ${sale.id}`,
          },
        });

        sales.push(sale);
        this.realtime.emitInventoryRefresh({ inventoryItemId: inv.id, reason: 'pos_sale' });
      }

      await this.activity.log('pos.checkout_completed', {
        itemsCount: params.items.length,
        totalRevenue,
        totalProfit,
        paymentMethod: params.paymentMethod
      });

      this.realtime.emitDashboardRefresh('pos_sale');

      return {
        success: true,
        salesCount: sales.length,
        totalRevenue,
        totalProfit,
        sales
      };
    }, { isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted });
  }
}