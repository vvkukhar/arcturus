import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportInventory(): Promise<unknown[]> {
    const rows = await this.prisma.inventoryItem.findMany({
      include: {
        item: true,
        assignedUser: true,
        images: {
          orderBy: {
            sortOrder: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return rows.map((row) => {
      const safe = row as any;

      return {
        id: row.id,
        itemId: row.itemId,
        setNumber: row.item?.setNumber ?? '',
        theme: row.item?.theme ?? '',
        kind: row.item?.kind ?? '',
        title: row.titleSnapshot,
        purchasePrice: row.purchasePrice,
        totalCost: row.totalCost,
        quantity: row.quantity,
        condition: row.condition,
        sealed: row.sealed,
        completenessPercent: safe.completenessPercent ?? '',
        boxState: safe.boxState ?? '',
        instructionsState: safe.instructionsState ?? '',
        expectedSalePriceManual: row.expectedSalePriceManual ?? '',
        extraCosts: safe.extraCosts ?? '',
        source: row.source ?? '',
        purchaseUrl: row.purchaseUrl ?? '',
        storageLocation: row.storageLocation ?? '',
        priority: row.priority,
        assignedUserId: row.assignedUserId ?? '',
        assignedUserName: row.assignedUser?.name ?? '',
        notes: row.notes ?? '',
        primaryImageUrl: row.images.find((image) => image.isPrimary)?.imageUrl ?? row.images[0]?.imageUrl ?? '',
        acquiredAt: safe.acquiredAt?.toISOString?.() ?? '',
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
      };
    });
  }
}