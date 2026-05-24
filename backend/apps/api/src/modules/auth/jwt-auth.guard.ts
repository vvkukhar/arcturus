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
    const rawToken = extractAuthToken(request);

    if (!rawToken) {
      throw new UnauthorizedException('Missing authentication token');
    }

    const tokenHash = this.hashToken(rawToken);
    const cacheKey = `session:${tokenHash}`;
    
    let sessionUser = await this.redis.get<any>(cacheKey);

    if (!sessionUser) {
      const session = await this.prisma.userSession.findUnique({
        where: { tokenHash },
        include: { user: true },
      });

      if (!session || !session.user?.active || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
        throw new UnauthorizedException('Session expired or invalid');
      }

      const user = session.user;

      sessionUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isPro: user.isPro,
        proExpiresAt: user.proExpiresAt ? new Date(user.proExpiresAt).toISOString() : null,
      };

      // Кешуємо сесію користувача на 5 хвилин
      await this.redis.set(cacheKey, sessionUser, 300);
    }

    // Відновлюємо реальний об'єкт дати для перевірки протермінування підписки
    if (sessionUser.proExpiresAt) {
      sessionUser.proExpiresAt = new Date(sessionUser.proExpiresAt);
    }

    request.user = sessionUser;
    return true;
  }
}