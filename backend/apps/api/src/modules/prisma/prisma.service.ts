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
        sale: this.createSoftDeleteExtension(),
        order: this.createSoftDeleteExtension(),
        returnRequest: this.createSoftDeleteExtension(),
        expense: this.createSoftDeleteExtension(),
      },
    }) as this;
  }

  private createSoftDeleteExtension() {
    return {
      async findMany({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirstOrThrow({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUnique({ args, query }: any) {
        const result = await query(args);
        return result?.deletedAt ? null : result;
      },
      async findUniqueOrThrow({ args, query }: any) {
        const result = await query(args);
        if (result?.deletedAt) throw new Error('Record not found');
        return result;
      },
      async count({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async aggregate({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async groupBy({ args, query }: any) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      }
    };
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}