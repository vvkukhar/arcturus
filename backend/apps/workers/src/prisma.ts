import { PrismaClient } from '@arcturus/db';

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === 'development'
      ? ['error', 'warn']
      : ['error'],
});