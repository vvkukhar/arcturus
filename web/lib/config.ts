// Беремо базовий URL, прибираємо зайвий слеш в кінці
const rawApiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://arcturus-api-idsb.onrender.com/api/v1').replace(/\/$/, '');
const rawWsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'https://arcturus-api-idsb.onrender.com').replace(/\/$/, '');

// Функція для гарантування наявності /api/v1
const ensureApiV1 = (url: string) => {
  // Якщо вже є /v1 в кінці, нічого не чіпаємо
  if (url.endsWith('/v1')) return url;
  // Якщо є /api, додаємо /v1
  if (url.endsWith('/api')) return `${url}/v1`;
  // Якщо нічого такого немає (наприклад, просто домен), додаємо /api/v1
  return `${url}/api/v1`;
};

export const appConfig = {
  name: 'Arcturus',
  adminTitle: 'Arcturus Admin',
  apiBaseUrl: ensureApiV1(rawApiUrl), // Тепер тут завжди буде /api/v1
  wsBaseUrl: rawWsUrl,
};