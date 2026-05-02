import { createClient } from 'redis';
import { generateId } from '../lib/utils';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
export const redisClient = createClient({ url: redisUrl });

redisClient.connect().then(() => console.log('Redis connected'));

export async function enqueueJob(queue: string, payload: any) {
  const id = generateId();
  await redisClient.lPush(queue, JSON.stringify({ id, payload }));
  return id;
}

export async function dequeueJob(queue: string) {
  const item = await redisClient.rPop(queue);
  if (!item) return null;
  return JSON.parse(item);
}