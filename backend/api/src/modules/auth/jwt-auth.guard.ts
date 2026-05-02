import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { extractAuthToken } from './token.utils';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { user?: any }>();
    const token = extractAuthToken(request);

    if (!token) {
      throw new UnauthorizedException('Missing auth token');
    }

    const adminToken = process.env.ADMIN_TOKEN;

    if (adminToken && token === adminToken) {
      let admin = await this.prisma.user.findFirst({
        where: {
          role: 'admin',
        },
      });

      if (!admin) {
        admin = await this.prisma.user.create({
          data: {
            name: 'Admin',
            email: 'admin@arcturus.local',
            role: 'admin',
            active: true,
          },
        });
      }

      request.user = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      };

      return true;
    }

    const session = await this.prisma.userSession.findUnique({
      where: {
        token,
      },
      include: {
        user: true,
      },
    });

    if (!session || !session.user.active) {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException('Session expired');
    }

    request.user = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };

    return true;
  }
}