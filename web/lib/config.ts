const rawApiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE || 'https://arcturus-api-idsb.onrender.com/api/v1';
const rawWsUrl = process.env.NEXT_PUBLIC_WS_URL || 'https://arcturus-api-idsb.onrender.com';

const ensureV1 = (url: string) => {
  const clean = url.replace(/\/$/, '');
  if (clean.endsWith('/v1')) return clean;
  if (clean.endsWith('/api')) return `${clean}/v1`;
  return `${clean}/api/v1`;
};

export const appConfig = {
  name: 'Arcturus',
  adminTitle: 'Arcturus Admin',
  apiBaseUrl: ensureV1(rawApiUrl),
  wsBaseUrl: rawWsUrl.replace(/\/$/, ''),
};