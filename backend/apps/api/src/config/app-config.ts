export const appConfig = {
  name: 'Arcturus API',
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN?.split(',') ?? ['http://localhost:3000'],
  nodeEnv: process.env.NODE_ENV ?? 'development',
  adminToken: process.env.ADMIN_TOKEN ?? null,
};