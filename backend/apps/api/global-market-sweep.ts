import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MACRO_TARGETS = [
  'LEGO Star Wars UCS',
  'LEGO Icons',
  'LEGO Architecture',
  'LEGO Creator Expert',
  'LEGO Technic 18+',
  'LEGO Ideas',
  'LEGO Lord of the Rings',
  'LEGO Harry Potter Collector',
  'LEGO Modular Buildings',
  'LEGO Ninjago City',
  'LEGO Batman Daily Bugle',
  'LEGO Marvel Sanctum Sanctorum',
  'LEGO Indiana Jones',
  'LEGO Rivendell',
  'LEGO Titanic',
  'LEGO Eiffel Tower',
  'LEGO Porsche',
  'LEGO Ferrari',
  'LEGO Lamborghini'
];

async function unleashHell() {
  console.log('🌐 Initiating Global Market Sweep...\n');

  const db = prisma as any;
  const sourceModel = db.source || db.scannerSource || db.marketSource;
  
  const sources = await sourceModel.findMany({ where: { enabled: true } });

  if (sources.length === 0) {
    console.error('❌ No active sources found. Run bootstrap first.');
    if ((globalThis as any).process) (globalThis as any).process.exit(1);
    return;
  }

  console.log(`📡 Found ${sources.length} active market sources. Injecting broad queries...`);

  let jobsCreated = 0;

  for (const source of sources) {
    for (const query of MACRO_TARGETS) {
      const existingJob = await db.scanJob.findFirst({
        where: {
          sourceCode: source.code,
          query: query,
          status: { in: ['queued', 'running'] }
        }
      });

      if (!existingJob) {
        await db.scanJob.create({
          data: {
            sourceCode: source.code,
            query: query,
            status: 'queued'
          }
        });
        jobsCreated++;
        console.log(`   🎯 Target locked: [${source.code}] -> "${query}"`);
      }
    }
  }

  console.log(`\n🔥 Sweep initiated. ${jobsCreated} macro-jobs injected into the queue.`);
  console.log('⏳ The scrapers are now pulling thousands of listings. Check /api/health for "listings" counter growth.');
}

unleashHell()
  .catch((e) => {
    console.error('❌ Sweep Failed:\n', e);
    if ((globalThis as any).process) (globalThis as any).process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });