import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Потрібна авторизація');
    
    // Адміни мають доступ до всього
    if (user.role === 'admin' || user.role === 'operator') return true;

    const dbUser = await this.prisma.user.findUnique({ where: { id: user.id } });
    
    if (!dbUser?.isPro || (dbUser.proExpiresAt && dbUser.proExpiresAt < new Date())) {
      throw new ForbiddenException('Потрібна підписка Arcturus PRO');
    }

    return true;
  }
}