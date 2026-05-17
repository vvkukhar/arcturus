import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InventorySearchService {
  constructor(private readonly prisma: PrismaService) {}

  async search(params: {
    q?: string;
    inStockOnly?: boolean;
    limit?: number;
  }): Promise<unknown[]> {
    const q = params.q?.trim();
    const limit = params.limit ?? 50;

    if (!q) {
      return this.prisma.inventoryItem.findMany({
        where: params.inStockOnly ? { quantity: { gt: 0 } } : undefined,
        include: { item: true },
        take: limit,
      });
    }

    // ВИКОРИСТОВУЄМО GIN ІНДЕКСИ + pg_trgm ДЛЯ ШВИДКОГО ПОШУКУ
    return this.prisma.$queryRaw`
      SELECT 
        "InventoryItem".*, 
        row_to_json("Item".*) as "item"
      FROM "InventoryItem"
      INNER JOIN "Item" ON "InventoryItem"."itemId" = "Item"."id"
      WHERE ("Item"."title" % ${q} OR "InventoryItem"."titleSnapshot" % ${q} OR "Item"."setNumber" ILIKE ${`%${q}%`})
      ${params.inStockOnly ? this.prisma.$queryRawUnsafe('AND "InventoryItem"."quantity" > 0') : this.prisma.$queryRawUnsafe('')}
      ORDER BY GREATEST(similarity("Item"."title", ${q}), similarity("InventoryItem"."titleSnapshot", ${q})) DESC
      LIMIT ${limit};
    `;
  }
}