const required = [
  'DATABASE_URL',
  'JWT_SECRET',
  'ADMIN_BOOTSTRAP_TOKEN',
  'CORS_ORIGINS',
];

const productionRequired = [
  'REDIS_PASSWORD',
  'INTERNAL_API_KEY',
];

function main(): void {
  const missing = required.filter((key) => !process.env[key]);

  if (process.env.NODE_ENV === 'production') {
    missing.push(...productionRequired.filter((key) => !process.env[key]));
  }

  if (missing.length > 0) {
    console.error('[env] Missing required environment variables:');
    for (const key of missing) {
      console.error(`- ${key}`);
    }

    process.exit(1);
  }

  console.log('[env] OK');
}

main();
export {};