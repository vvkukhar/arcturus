import IORedis from 'ioredis';

export function createRedisConnection(): IORedis {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (redisUrl) {
    return new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
    });
  }

  return new IORedis({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379),
    password: process.env.REDIS_PASSWORD || undefined,
    maxRetriesPerRequest: null,
  });
}