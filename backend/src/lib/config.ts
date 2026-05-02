export const appConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  apiBaseUrl: process.env.API_BASE_URL ?? 'http://localhost:4000/api',
  adminToken: process.env.ADMIN_TOKEN ?? 'super-secret-token',
};