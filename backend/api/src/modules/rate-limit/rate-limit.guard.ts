import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Request } from 'express';
import { RateLimitService } from './rate-limit.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly rateLimitService: RateLimitService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    const ip =
      request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ||
      request.socket.remoteAddress ||
      'unknown';

    const path = request.path ?? request.originalUrl ?? 'unknown';

    const isAuthRoute = path.includes('/auth/login');
    const isPublicReserveRoute = path.includes('/public/reserve');

    this.rateLimitService.check({
      key: `${ip}:${path}`,
      limit: isAuthRoute ? 10 : isPublicReserveRoute ? 20 : 300,
      windowMs: 1000 * 60,
    });

    return true;
  }
}