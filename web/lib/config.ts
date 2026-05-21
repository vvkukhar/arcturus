const rawApiUrl = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://arcturus-api-idsb.onrender.com/api/v1').replace(/\/$/, '');
const rawWsUrl = (process.env.NEXT_PUBLIC_WS_URL || 'https://arcturus-api-idsb.onrender.com').replace(/\/$/, '');

const ensureApiV1 = (url: string) => {
  if (url.endsWith('/v1')) return url;
  if (url.endsWith('/api')) return `${url}/v1`;
  return `${url}/api/v1`;
};

export const appConfig = {
  name: 'Arcturus',
  adminTitle: 'Arcturus Admin',
  apiBaseUrl: ensureApiV1(rawApiUrl),
  wsBaseUrl: rawWsUrl,
};