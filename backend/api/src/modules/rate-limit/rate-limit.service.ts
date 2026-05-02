import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

type Bucket = {
  count: number;
  resetAt: number;
};

@Injectable()
export class RateLimitService {
  private readonly buckets = new Map<string, Bucket>();

  check(params: {
    key: string;
    limit: number;
    windowMs: number;
  }): void {
    const now = Date.now();
    const current = this.buckets.get(params.key);

    if (!current || current.resetAt <= now) {
      this.buckets.set(params.key, {
        count: 1,
        resetAt: now + params.windowMs,
      });

      return;
    }

    current.count += 1;

    if (current.count > params.limit) {
      throw new HttpException('Too many requests', HttpStatus.TOO_MANY_REQUESTS);
    }
  }

  cleanup(): void {
    const now = Date.now();

    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}