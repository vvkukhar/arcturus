import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventorySearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: {
    q?: string;
    theme?: string;
    kind?: string;
    condition?: string;
    sealed?: boolean;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params.q?.trim();

    return this.prisma.inventoryItem.findMany({
      where: {
        quantity: params.inStockOnly ? { gt: 0 } : undefined,
        condition: params.condition,
        sealed: params.sealed,
        expectedSalePriceManual:
          params.minPrice != null || params.maxPrice != null
            ? {
                gte: params.minPrice,
                lte: params.maxPrice,
              }
            : undefined,
        item: {
          kind: params.kind,
          theme: params.theme
            ? {
                equals: params.theme,
                mode: 'insensitive',
              }
            : undefined,
        },
        OR:
          q && q.length > 0
            ? [
                {
                  titleSnapshot: {
                    contains: q,
                    mode: 'insensitive',
                  },
                },
                {
                  item: {
                    title: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  item: {
                    setNumber: {
                      contains: q,
                      mode: 'insensitive',
                    },
                  },
                },
              ]
            : undefined,
      },
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
      take: params.limit ?? 100,
    });
  }
}