import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RateLimitService {
  constructor(private readonly redis: RedisService) {}

  async check(params: { key: string; limit: number; windowMs: number }): Promise<void> {
    const redisKey = `ratelimit:${params.key}`;
    
    const current = await this.redis.client.incr(redisKey);

    if (current === 1) {
      await this.redis.client.pexpire(redisKey, params.windowMs);
    }

    if (current > params.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }
}