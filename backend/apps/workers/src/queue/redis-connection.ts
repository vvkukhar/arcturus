import Redis from 'ioredis';

export function createRedisConnection(): Redis {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (redisUrl) {
    return new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      family: 0,
      enableReadyCheck: false,
      retryStrategy(times) {
        return Math.min(times * 100, 3000);
      }
    });
  }

  return new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: Number(process.env.REDIS_PORT || 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
    family: 0,
    enableReadyCheck: false,
    retryStrategy(times) {
      return Math.min(times * 100, 3000);
    }
  });
}