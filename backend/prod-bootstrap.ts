const API_BASE = 'https://arcturus-api-idsb.onrender.com/api';
const ADMIN_TOKEN = 'NinjagoLegoMinecraftStarWarsLordoftheRings_201119772007';

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
  { code: 'ebay', name: 'eBay', type: 'marketplace' }
];

async function api(path: string, method: string = 'GET', body?: any) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${ADMIN_TOKEN}`
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(`[${method}] ${path} failed: ${res.statusText}`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

async function bootstrap() {
  console.log('🚀 Initiating Arcturus Production Bootstrap...');

  console.log('\n📦 1. Activating Market Sources...');
  for (const src of SOURCES) {
    await api('/scanner/sources', 'POST', { ...src, enabled: true });
    console.log(`   ✅ Source activated: ${src.name}`);
  }

  console.log('\n💎 2. Injecting High-ROI Assets & Watchlist Targets...');
  for (const asset of HIGH_ROI_ASSETS) {
    const item = await api('/items', 'POST', {
      title: asset.title,
      setNumber: asset.setNumber,
      theme: asset.theme,
      kind: 'set'
    });
    
    await api('/watchlist', 'POST', {
      itemId: item.data.id,
      titleSnapshot: asset.title,
      desiredBuyPrice: asset.desired,
      maxBuyPrice: asset.max,
      targetSellPrice: asset.target,
      priority: 90,
      active: true
    });
    console.log(`   ✅ Injected: ${asset.title} (Target Profit: ${asset.target - asset.max} ₴)`);
  }

  console.log('\n⚙️ 3. Triggering Initial Market Scans...');
  for (const src of SOURCES) {
    await api('/scanner/jobs', 'POST', { sourceCode: src.code });
    console.log(`   ✅ Job queued for ${src.name}`);
  }

  console.log('\n🧠 4. Enqueueing AI Decision Engine...');
  await api('/queue/deals/detect', 'POST');
  await api('/queue/decisions/recompute', 'POST');

  console.log('\n🏁 Arcturus is now hunting for deals. Check the dashboard in 5 minutes.');
}

bootstrap().catch(console.error);