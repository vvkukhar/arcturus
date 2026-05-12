import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { extractAuthToken } from './token.utils';
import * as crypto from 'crypto';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: any }>();
    const token = extractAuthToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const tokenHash = this.hashToken(token);
    const cacheKey = `session:${tokenHash}`;
    
    let sessionUser = await this.redis.get<any>(cacheKey);

    if (!sessionUser) {
      const session = await this.prisma.userSession.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!session || !session.user.active || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      sessionUser = {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: session.user.role,
      };

      await this.redis.set(cacheKey, sessionUser, 300); // Кешуємо на 5 хвилин
    }

    request.user = sessionUser;
    return true;
  }
}