const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting BrickLink Minifigure seed...');
  
  // ПЕРЕВІР, ЩО ФАЙЛ НАЗИВАЄТЬСЯ САМЕ ТАК
  const filePath = path.join(__dirname, 'minifigs.txt');
  
  if (!fs.existsSync(filePath)) {
    console.error('❌ File minifigs.txt not found in ' + __dirname);
    process.exit(1);
  }

  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  let isHeader = true;
  let chunk = [];
  let totalSeeded = 0;

  for await (const line of rl) {
    if (isHeader) { isHeader = false; continue; }
    
    // Роздільник може бути \t (tab), якщо файл з сайту BrickLink
    const columns = line.split('\t'); 
    
    // Індекси для стандартного файлу Minifigures з BrickLink
    const figNum = columns[2]?.trim(); 
    const name = columns[3]?.trim();

    if (!figNum || !name) continue;

    chunk.push({
      id: `item_bl_${figNum.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      kind: 'minifigure',
      title: name,
      setNumber: figNum.toLowerCase(),
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

main().catch(console.error).finally(() => prisma.$disconnect());