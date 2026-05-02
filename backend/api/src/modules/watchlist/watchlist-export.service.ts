import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WatchlistExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportRows(): Promise<unknown[]> {
    const rows = await this.prisma.watchlistItem.findMany({
      include: {
        item: true,
        assignedUser: true,
      },
      orderBy: [
        {
          priority: 'desc',
        },
        {
          createdAt: 'desc',
        },
      ],
    });

    return rows.map((row) => ({
      id: row.id,
      itemId: row.itemId,
      setNumber: row.item?.setNumber ?? '',
      theme: row.item?.theme ?? '',
      kind: row.item?.kind ?? '',
      title: row.titleSnapshot,
      desiredBuyPrice: row.desiredBuyPrice,
      maxBuyPrice: row.maxBuyPrice,
      targetSellPrice: row.targetSellPrice ?? '',
      targetRoi:
        row.targetSellPrice != null && row.maxBuyPrice > 0
          ? Number(
              (
                ((row.targetSellPrice - row.maxBuyPrice) / row.maxBuyPrice) *
                100
              ).toFixed(2),
            )
          : '',
      active: row.active,
      priority: row.priority,
      assignedUserId: row.assignedUserId ?? '',
      assignedUserName: row.assignedUser?.name ?? '',
      notes: row.notes ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    }));
  }
}