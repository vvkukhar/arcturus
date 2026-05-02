export const appConfig = {
  name: 'Arcturus Backend',
  port: process.env.PORT ? Number(process.env.PORT) : 4000,
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:4000/api',
  adminToken: process.env.ADMIN_TOKEN ?? 'supersecret',
  env: process.env.NODE_ENV ?? 'development',
};