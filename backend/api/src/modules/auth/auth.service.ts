import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async loginWithToken(token: string): Promise<{
    token: string;
    user: {
      id: string;
      name: string;
      email: string | null;
      role: string;
    };
  }> {
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminToken || token !== adminToken) {
      throw new UnauthorizedException('Invalid token');
    }

    let user = await this.prisma.user.findFirst({
      where: {
        role: 'admin',
      },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: 'Admin',
          email: 'admin@arcturus.local',
          role: 'admin',
          active: true,
        },
      });
    }

    const sessionToken = randomBytes(48).toString('hex');

    await this.prisma.userSession.create({
      data: {
        userId: user.id,
        token: sessionToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
      },
    });

    return {
      token: sessionToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async me(userId: string): Promise<unknown> {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
      },
    });
  }

  async logout(token: string): Promise<{ ok: true }> {
    await this.prisma.userSession.deleteMany({
      where: {
        token,
      },
    });

    return {
      ok: true,
    };
  }
}