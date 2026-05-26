import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class B2bGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];

    if (!apiKey) throw new UnauthorizedException('API Key required');

    const user = await this.prisma.user.findUnique({
      where: { apiKey },
    });

    if (!user || user.apiTier === 'none') {
      throw new UnauthorizedException('Invalid API Key or Insufficient Tier');
    }

    request.b2bUser = user;
    return true;
  }
}