import { PrismaClient } from '@prisma/client';

export * from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Створюємо базовий клієнт
const basePrisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['error', 'warn']
        : ['error'],
  });

// Список моделей, які використовують Soft Deletes (deletedAt)
const softDeleteModels = ['Sale', 'Order', 'ReturnRequest', 'Expense'];

// Розширюємо клієнт: автоматично відфільтровуємо видалені записи
export const prisma = basePrisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }: { model: any, operation: any, args: any, query: any }) {
        if (softDeleteModels.includes(model)) {
          // Застосовуємо фільтр тільки для операцій читання та підрахунку
          if (
            operation === 'findUnique' ||
            operation === 'findUniqueOrThrow' ||
            operation === 'findFirst' ||
            operation === 'findFirstOrThrow' ||
            operation === 'findMany' ||
            operation === 'count' ||
            operation === 'aggregate' ||
            operation === 'groupBy'
          ) {
            // Безпечно додаємо deletedAt: null до існуючого where
            args.where = { ...args.where, deletedAt: null };
          }
        }
        return query(args);
      },
    },
  },
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = basePrisma as any;