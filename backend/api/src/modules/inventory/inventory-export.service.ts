import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventoryExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportRows(): Promise<unknown[]> {
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

    return rows.map((row) => ({
      id: row.id,
      itemId: row.itemId,
      setNumber: row.item?.setNumber ?? '',
      theme: row.item?.theme ?? '',
      kind: row.item?.kind ?? '',
      title: row.titleSnapshot,
      condition: row.condition,
      sealed: row.sealed,
      completenessPercent: row.completenessPercent,
      boxState: row.boxState ?? '',
      instructionsState: row.instructionsState ?? '',
      quantity: row.quantity,
      purchasePrice: row.purchasePrice,
      extraCosts: row.extraCosts,
      totalCost: row.totalCost,
      expectedSalePriceManual: row.expectedSalePriceManual ?? '',
      assignedUserId: row.assignedUserId ?? '',
      assignedUserName: row.assignedUser?.name ?? '',
      imageCount: row.images.length,
      primaryImage:
        row.images.find((image) => image.isPrimary)?.imageUrl ??
        row.images[0]?.imageUrl ??
        '',
      notes: row.notes ?? '',
      acquiredAt: row.acquiredAt?.toISOString() ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }
}