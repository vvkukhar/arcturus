import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const HIGH_ROI_ASSETS = [
  { title: 'LEGO Star Wars UCS Millennium Falcon', setNumber: '75192', theme: 'Star Wars', desired: 22000, max: 26000, target: 34500 },
  { title: 'LEGO Icons Lion Knights Castle', setNumber: '10305', theme: 'Icons', desired: 11000, max: 13000, target: 16800 },
  { title: 'LEGO Ninjago City Gardens', setNumber: '71741', theme: 'Ninjago', desired: 9000, max: 10500, target: 14200 },
  { title: 'LEGO Star Wars UCS AT-AT', setNumber: '75313', theme: 'Star Wars', desired: 20000, max: 24000, target: 32000 },
  { title: 'LEGO Ideas Home Alone', setNumber: '21330', theme: 'Ideas', desired: 7500, max: 8500, target: 11400 },
  { title: 'LEGO Lord of the Rings Rivendell', setNumber: '10316', theme: 'Icons', desired: 14000, max: 16000, target: 21000 }
];

const SOURCES = [
  { code: 'olx', name: 'OLX Ukraine', type: 'marketplace' },
  { code: 'bricklink', name: 'BrickLink', type: 'marketplace' },
  { code: 'ebay', name: 'eBay', type: 'marketplace' },
  { code: 'brickowl', name: 'BrickOwl', type: 'marketplace' }
];

async function bootstrap() {
  console.log('🚀 Initiating Arcturus Direct Prisma Bootstrap...\n');

  console.log('📦 1. Activating Market Sources...');
  for (const src of SOURCES) {
    const existingSource = await prisma.marketSource.findFirst({ where: { code: src.code } });
    if (existingSource) {
      await prisma.marketSource.update({
        where: { id: existingSource.id },
        data: { enabled: true, name: src.name, type: src.type }
      });
    } else {
      await prisma.marketSource.create({
        data: { code: src.code, name: src.name, type: src.type, enabled: true }
      });
    }
    console.log(`   ✅ Source ready: ${src.name}`);
  }

  console.log('\n💎 2. Injecting High-ROI Assets & Watchlist Targets...');
  for (const asset of HIGH_ROI_ASSETS) {
    let item = await prisma.item.findFirst({ where: { setNumber: asset.setNumber } });
    
    if (!item) {
      item = await prisma.item.create({
        data: { title: asset.title, setNumber: asset.setNumber, theme: asset.theme, kind: 'set' }
      });
    } else {
      item = await prisma.item.update({
        where: { id: item.id },
        data: { title: asset.title, theme: asset.theme }
      });
    }

    const existingWatchlist = await prisma.watchlistItem.findFirst({ where: { itemId: item.id } });

    if (existingWatchlist) {
      await prisma.watchlistItem.update({
        where: { id: existingWatchlist.id },
        data: {
          titleSnapshot: asset.title,
          desiredBuyPrice: asset.desired,
          maxBuyPrice: asset.max,
          targetSellPrice: asset.target,
          priority: 90,
          active: true
        }
      });
    } else {
      await prisma.watchlistItem.create({
        data: {
          itemId: item.id,
          titleSnapshot: asset.title,
          desiredBuyPrice: asset.desired,
          maxBuyPrice: asset.max,
          targetSellPrice: asset.target,
          priority: 90,
          active: true
        }
      });
    }
    console.log(`   ✅ Injected: ${asset.title} (Target Profit: ${asset.target - asset.max} ₴)`);
  }

  console.log('\n🏁 Database seeded successfully. Render workers (Scheduler) will automatically pick up active sources on their next tick.');
}

bootstrap()
  .catch((e) => {
    console.error('❌ Bootstrap Failed:\n', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });