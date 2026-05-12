import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const adminPassword = await bcrypt.hash('admin123', 10);
  const operatorPassword = await bcrypt.hash('operator123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@arcturus.local' },
    update: { passwordHash: adminPassword },
    create: {
      name: 'Admin',
      email: 'admin@arcturus.local',
      passwordHash: adminPassword,
      role: 'admin',
      active: true,
    },
  });

  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: 'main' },
    update: {},
    create: {
      code: 'main',
      name: 'Main Storage',
      active: true,
    },
  });

  const items = [
    {
      id: 'seed_10354',
      title: 'LEGO Lord of the Rings: The Shire',
      setNumber: '10354',
      theme: 'Lord of the Rings',
      kind: 'set',
    },
    {
      id: 'seed_9518',
      title: 'LEGO Dacta Community Workers',
      setNumber: '9518',
      theme: 'LEGO Dacta',
      kind: 'set',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: { ...item, conditionDefault: 'used' },
    });
  }
}

main()
  .catch(() => process.exit(1))
  .finally(async () => await prisma.$disconnect());