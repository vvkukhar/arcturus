import Redis from 'ioredis';

export function createRedisConnection(): Redis {
  const redisUrl = process.env.REDIS_URL?.trim();

  const options = {
    maxRetriesPerRequest: null,
    family: 0,
    enableReadyCheck: false,
    retryStrategy(times: number) {
      return Math.min(times * 100, 3000);
    },
    reconnectOnError() {
      return true;
    }
  };

  if (redisUrl) {
    const client = new Redis(redisUrl, options);
    client.on('error', (err) => console.error('[Worker Redis Error]', err.message));
    return client;
  }

  const client = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    ...options
  });

  client.on('error', (err) => console.error('[Worker Redis Error]', err.message));
  return client;
}