import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('[seed] start');

  const admin = await prisma.user.upsert({
    where: { email: 'admin@arcturus.local' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@arcturus.local',
      role: 'admin',
      active: true,
    },
  });

  const operator = await prisma.user.upsert({
    where: { email: 'operator@arcturus.local' },
    update: {},
    create: {
      name: 'Operator',
      email: 'operator@arcturus.local',
      role: 'operator',
      active: true,
    },
  });

  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: 'main' },
    update: {},
    create: {
      code: 'main',
      name: 'Main Storage',
      address: 'Home / primary storage',
      active: true,
    },
  });

  const locationA1 = await prisma.storageLocation.upsert({
    where: {
      warehouseId_code: {
        warehouseId: mainWarehouse.id,
        code: 'A1',
      },
    },
    update: {},
    create: {
      warehouseId: mainWarehouse.id,
      code: 'A1',
      name: 'Shelf A1',
      zone: 'A',
      shelf: '1',
      box: null,
      active: true,
    },
  });

  const sources = [
    { code: 'olx', name: 'OLX', type: 'marketplace' },
    { code: 'bricklink', name: 'BrickLink', type: 'marketplace' },
    { code: 'ebay', name: 'eBay', type: 'marketplace' },
  ];

  for (const source of sources) {
    await prisma.marketSource.upsert({
      where: { code: source.code },
      update: {},
      create: {
        code: source.code,
        name: source.name,
        type: source.type,
        enabled: true,
      },
    });
  }

  const items = [
    {
      id: 'seed_70621',
      title: 'LEGO Ninjago 70621 The Vermillion Attack',
      setNumber: '70621',
      theme: 'Ninjago',
      kind: 'set',
    },
    {
      id: 'seed_75280',
      title: 'LEGO Star Wars 75280 501st Legion Clone Troopers',
      setNumber: '75280',
      theme: 'Star Wars',
      kind: 'set',
    },
    {
      id: 'seed_76424',
      title: 'LEGO Harry Potter 76424 Flying Ford Anglia',
      setNumber: '76424',
      theme: 'Harry Potter',
      kind: 'set',
    },
  ];

  for (const item of items) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: {
        id: item.id,
        title: item.title,
        setNumber: item.setNumber,
        theme: item.theme,
        kind: item.kind,
        conditionDefault: 'used',
      },
    });
  }

  const demoItem = await prisma.item.findFirst({
    where: {
      id: 'seed_70621',
    },
  });

  if (demoItem) {
    const existingInventory = await prisma.inventoryItem.findFirst({
      where: {
        itemId: demoItem.id,
        titleSnapshot: demoItem.title,
      },
    });

    if (!existingInventory) {
      await prisma.inventoryItem.create({
        data: {
          itemId: demoItem.id,
          titleSnapshot: demoItem.title,
          purchasePrice: 1200,
          totalCost: 1200,
          quantity: 1,
          condition: 'used',
          sealed: false,
          expectedSalePriceManual: 1900,
          assignedUserId: operator.id,
          warehouseId: mainWarehouse.id,
          storageLocationId: locationA1.id,
          storageLocation: locationA1.name,
          priority: 70,
        },
      });
    }

    const existingWatchlist = await prisma.watchlistItem.findFirst({
      where: {
        itemId: demoItem.id,
        titleSnapshot: demoItem.title,
      },
    });

    if (!existingWatchlist) {
      await prisma.watchlistItem.create({
        data: {
          itemId: demoItem.id,
          titleSnapshot: demoItem.title,
          desiredBuyPrice: 900,
          maxBuyPrice: 1200,
          targetSellPrice: 1900,
          active: true,
          priority: 80,
          assignedUserId: operator.id,
        },
      });
    }
  }

  await prisma.activityLog.create({
    data: {
      action: 'seed.completed',
      payloadJson: {
        adminId: admin.id,
        operatorId: operator.id,
        warehouseId: mainWarehouse.id,
        locationId: locationA1.id,
      },
    },
  });

  console.log('[seed] done');
}

main()
  .catch((error) => {
    console.error('[seed error]', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });