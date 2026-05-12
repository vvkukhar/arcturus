import { PrismaClient } from '@prisma/client';
export * from '@prisma/client';

const softDeleteModels = ['Sale', 'Order', 'ReturnRequest', 'Expense'];

export const createPrismaClient = () => {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  return prisma.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }: any) {
          if (softDeleteModels.includes(model)) {
            if (['findFirst', 'findFirstOrThrow', 'findMany', 'count', 'aggregate', 'groupBy'].includes(operation)) {
              args.where = { ...args.where, deletedAt: null };
            } else if (operation === 'findUnique' || operation === 'findUniqueOrThrow') {
              const result = await query(args);
              if (result && result.deletedAt !== null) {
                if (operation === 'findUniqueOrThrow') throw new Error(`${model} not found`);
                return null;
              }
              return result;
            }
          }
          return query(args);
        },
      },
    },
  });
};