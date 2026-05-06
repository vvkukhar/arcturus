jest.setTimeout(60000);

process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT ?? '4001';
process.env.ADMIN_BOOTSTRAP_TOKEN =
  process.env.ADMIN_BOOTSTRAP_TOKEN ?? 'supersecret';
process.env.JWT_SECRET = process.env.JWT_SECRET ?? 'test-jwt-secret';
process.env.CORS_ORIGINS = process.env.CORS_ORIGINS ?? 'http://localhost:3000';