/// <reference types="node" />

import { PrismaClient } from '@prisma/client';
import * as https from 'https';
import * as zlib from 'zlib';
import * as readline from 'readline';

const prisma = new PrismaClient();

const THEMES_URL = 'https://cdn.rebrickable.com/media/downloads/themes.csv.gz';
const SETS_URL = 'https://cdn.rebrickable.com/media/downloads/sets.csv.gz';
const MINIFIGS_URL = 'https://cdn.rebrickable.com/media/downloads/minifigs.csv.gz';

async function downloadAndParseGzipCsv(url: string, onRow: (row: string[]) => Promise<void>): Promise<void> {
  return new Promise((resolve, reject) => {
    https.get(url, async (response: any) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        try {
          await downloadAndParseGzipCsv(response.headers.location, onRow);
          resolve();
        } catch (err) {
          reject(err);
        }
        return;
      }
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download: Status ${response.statusCode} from ${url}`));
      }

      const gunzip = zlib.createGunzip();
      response.pipe(gunzip);

      const rl = readline.createInterface({
        input: gunzip,
        crlfDelay: Infinity,
      });

      // 🔥 ОСЬ ТЕПЕР ТУТ РЕАЛЬНИЙ СИНХРОННИЙ ІТЕРАТОР 🔥
      try {
        let isHeader = true;
        for await (const line of rl) {
          if (isHeader) {
            isHeader = false;
            continue;
          }
          
          const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
          if (matches) {
            const row = matches.map((val: string) => val.replace(/^"|"$/g, '').trim());
            await onRow(row); // Чекаємо на 100%, повний Backpressure!
          }
        }
        resolve();
      } catch (err) {
        reject(err);
      }
    }).on('error', (err: any) => reject(err));
  });
}

async function main() {
  console.log('🚀 Starting Rebrickable global LEGO dictionary seed...');

  const themesMap = new Map<string, string>();
  console.log('📥 Downloading and indexing LEGO themes...');
  await downloadAndParseGzipCsv(THEMES_URL, async (row: string[]) => {
    if (row[0] && row[1]) {
      themesMap.set(row[0], row[1]);
    }
  });
  console.log(`✅ Indexed ${themesMap.size} Lego themes.`);

  // 1. СТРІМІНГ КОНСТРУКТОРІВ
  console.log('📥 Downloading and streaming LEGO sets to database...');
  let chunk: any[] = [];
  let totalSetsSeeded = 0;

  await downloadAndParseGzipCsv(SETS_URL, async (row: string[]) => {
    const setNumWithSuffix = row[0] || '';
    const name = row[1] || '';
    const themeId = row[3] || '';
    const setNumber = setNumWithSuffix.split('-')[0];

    if (!setNumber || !name) return;
    const themeName = themesMap.get(themeId) || 'LEGO';

    chunk.push({
      id: `item_rb_${setNumWithSuffix.replace(/[^a-zA-Z0-9]/g, '')}`,
      kind: 'set',
      title: name,
      setNumber: setNumber,
      theme: themeName,
    });

    if (chunk.length >= 1000) {
      await prisma.item.createMany({ data: chunk, skipDuplicates: true });
      totalSetsSeeded += chunk.length;
      console.log(`📦 Seeded subtotal (Sets): ${totalSetsSeeded} items...`);
      chunk = [];
    }
  });

  if (chunk.length > 0) {
    await prisma.item.createMany({ data: chunk, skipDuplicates: true });
    totalSetsSeeded += chunk.length;
    chunk = [];
  }
  console.log(`✅ Done with Sets! Total seeded: ${totalSetsSeeded}`);

  // 2. СТРІМІНГ МІНІФІГУРОК
  console.log('📥 Downloading and streaming LEGO Minifigures to database...');
  let totalFigsSeeded = 0;

  await downloadAndParseGzipCsv(MINIFIGS_URL, async (row: string[]) => {
    const figNum = row[0] || '';
    const name = row[1] || '';

    if (!figNum || !name) return;

    chunk.push({
      id: `item_fig_${figNum.replace(/[^a-zA-Z0-9]/g, '')}`,
      kind: 'minifigure',
      title: name,
      setNumber: figNum,
      theme: 'Minifigures',
    });

    if (chunk.length >= 1000) {
      await prisma.item.createMany({ data: chunk, skipDuplicates: true });
      totalFigsSeeded += chunk.length;
      console.log(`🤖 Seeded subtotal (Minifigs): ${totalFigsSeeded} items...`);
      chunk = [];
    }
  });

  if (chunk.length > 0) {
    await prisma.item.createMany({ data: chunk, skipDuplicates: true });
    totalFigsSeeded += chunk.length;
  }

  console.log(`🏁 Global Seed Complete! Successfully injected ${totalSetsSeeded} sets and ${totalFigsSeeded} unique Minifigures into database.`);
}

main()
  .catch((e: any) => {
    console.error('❌ Critical seed failure:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });