const API_BASE = process.env.API_BASE ?? 'http://localhost:4000/api';

async function check(path: string): Promise<void> {
  const response = await fetch(`${API_BASE}${path}`);

  if (!response.ok) {
    throw new Error(`${path} failed with ${response.status}`);
  }

  console.log(`[health] ${path} OK`);
}

async function main(): Promise<void> {
  console.log(`[health] API_BASE=${API_BASE}`);

  await check('/health');
  await check('/metrics/json');

  console.log('[health] ✅ production health check passed');
}

main().catch((error) => {
  console.error('[health] ❌ production health check failed');
  console.error(error);
  process.exit(1);
});