import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });

    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }: any) {
            const softDeleteModels = ['Sale', 'Order', 'ReturnRequest', 'Expense'];
            if (
              softDeleteModels.includes(model) && 
              ['findMany', 'findFirst', 'findFirstOrThrow', 'findUnique', 'findUniqueOrThrow', 'count', 'aggregate', 'groupBy'].includes(operation)
            ) {
              if (args.where) {
                if (args.where.deletedAt === undefined) {
                  args.where.deletedAt = null;
                }
              } else {
                args.where = { deletedAt: null };
              }
            }
            return query(args);
          }
        }
      },
    }) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}