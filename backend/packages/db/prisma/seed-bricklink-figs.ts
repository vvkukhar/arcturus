import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting BrickLink Minifigure seed...');
  
  const filePath = path.join(__dirname, 'minifigs.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File not found! Download Minifigures catalog from BrickLink (Tab delimited text) and save as "minifigs.txt" in the prisma folder.');
    process.exit(1);
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let idIdx = -1;
  let nameIdx = -1;

  let chunk: any[] = [];
  let totalSeeded = 0;

  for await (const line of rl) {
    const columns = line.split('\t');
    
    if (isHeader) {
      idIdx = columns.indexOf('Item No');
      nameIdx = columns.indexOf('Item Name');
      isHeader = false;
      continue;
    }

    // Якщо хедери не знайдено, використовуємо стандартні індекси BrickLink (0 - Type, 1 - Category, 2 - Item No, 3 - Item Name)
    if (idIdx === -1) idIdx = 2;
    if (nameIdx === -1) nameIdx = 3;

    const setNumber = columns[idIdx]?.trim();
    const title = columns[nameIdx]?.trim();

    if (!setNumber || !title) continue;

    chunk.push({
      id: `item_bl_${setNumber.replace(/[^a-zA-Z0-9]/g, '')}`,
      kind: 'minifigure',
      title: title,
      setNumber: setNumber.toLowerCase(),
      theme: 'Minifigures',
      conditionDefault: 'used'
    });

    if (chunk.length >= 1000) {
      await prisma.item.createMany({ data: chunk, skipDuplicates: true });
      totalSeeded += chunk.length;
      console.log(`🤖 Seeded subtotal: ${totalSeeded} minifigures...`);
      chunk = [];
    }
  }

  if (chunk.length > 0) {
    await prisma.item.createMany({ data: chunk, skipDuplicates: true });
    totalSeeded += chunk.length;
  }

  console.log(`✅ Done! Successfully injected ${totalSeeded} BrickLink minifigures.`);
}

main()
  .catch((e) => {
    console.error('❌ Seed Failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });