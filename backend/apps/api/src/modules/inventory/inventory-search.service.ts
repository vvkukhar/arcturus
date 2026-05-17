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
    const limit = params.limit ?? 50;

    // Якщо немає текстового пошуку, застосовуємо всі Prisma-фільтри
    if (!q) {
      const where: any = {};
      
      if (params.inStockOnly) where.quantity = { gt: 0 };
      if (params.condition) where.condition = params.condition;
      if (params.sealed !== undefined) where.sealed = params.sealed;
      
      if (params.minPrice !== undefined || params.maxPrice !== undefined) {
        where.expectedSalePriceManual = {};
        if (params.minPrice !== undefined) where.expectedSalePriceManual.gte = params.minPrice;
        if (params.maxPrice !== undefined) where.expectedSalePriceManual.lte = params.maxPrice;
      }

      if (params.theme || params.kind) {
        where.item = {};
        if (params.theme) where.item.theme = params.theme;
        if (params.kind) where.item.kind = params.kind;
      }

      return this.prisma.inventoryItem.findMany({
        where,
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