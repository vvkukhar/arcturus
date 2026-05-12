import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { RedisService } from '../modules/redis/redis.service';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    
    if (request.method !== 'GET') {
      return next.handle();
    }

    const userId = request.user?.id || 'public';
    const key = `api_cache:${userId}:${request.originalUrl || request.url}`;
    const cachedResponse = await this.redis.get<any>(key);

    if (cachedResponse) {
      return of(cachedResponse);
    }

    return next.handle().pipe(
      tap(async (response) => {
        if (response) {
          await this.redis.set(key, response, 30);
        }
      }),
    );
  }
}