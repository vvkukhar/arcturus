import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitService {
  constructor(public readonly redis: RedisService) {}

  async check(params: { key: string; limit: number; windowMs: number }): Promise<void> {
    const redisKey = `ratelimit:${params.key}`;
    const client = this.redis.getClient();

    const results = await client.multi().incr(redisKey).pttl(redisKey).exec();

    if (!results) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }

    const current = results[0][1] as number;
    const ttl = results[1][1] as number;

    if (current === 1 || ttl === -1) {
      await client.pexpire(redisKey, params.windowMs);
    }

    if (current > params.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}