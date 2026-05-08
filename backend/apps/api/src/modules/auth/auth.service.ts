import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';

export type AuthUser = {
  id: string;
  name: string;
  email: string | null;
  role: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  extractBearerToken(authorization?: string | null): string | null {
    if (!authorization) return null;
    const [type, token] = authorization.split(' ');
    if (type !== 'Bearer' || !token) return null;
    return token;
  }

  async validateToken(token: string): Promise<AuthUser> {
    return this.verifyToken(token);
  }

  async verifyToken(token: string): Promise<AuthUser> {
    const cacheKey = `session:${token}`;
    let sessionUser = await this.redis.get<AuthUser>(cacheKey);

    if (sessionUser) return sessionUser;

    const session = await this.prisma.userSession.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!session || !session.user || !session.user.active) {
      throw new UnauthorizedException('Invalid session');
    }

    if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
      await this.prisma.userSession.delete({ where: { id: session.id } });
      throw new UnauthorizedException('Session expired');
    }

    sessionUser = {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
    };

    await this.redis.set(cacheKey, sessionUser, 300);
    return sessionUser;
  }

  async login(body: { email?: string; password?: string; token?: string; rememberMe?: boolean }): Promise<{ token: string; user: AuthUser }> {
    let user;

    if (body.token) {
      const adminToken = process.env.ADMIN_TOKEN;
      if (!adminToken || adminToken.length < 16) {
        throw new Error('ADMIN_TOKEN is not securely configured');
      }
      if (body.token !== adminToken) {
        throw new UnauthorizedException('Invalid admin bootstrap token');
      }
      user = await this.prisma.user.findFirst({ where: { role: 'admin' } });
      if (!user) {
        const hash = await bcrypt.hash(body.token, 10);
        user = await this.prisma.user.create({
          data: { name: 'Admin', email: 'admin@arcturus.local', passwordHash: hash, role: 'admin', active: true },
        });
      }
    } else if (body.email && body.password) {
      user = await this.prisma.user.findUnique({ where: { email: body.email } });
      if (!user || !user.active) {
        throw new UnauthorizedException('Invalid credentials');
      }
      if (!user.passwordHash) {
        if (body.password === process.env.ADMIN_TOKEN && user.role === 'admin') {
          const hash = await bcrypt.hash(body.password, 10);
          user = await this.prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: hash },
          });
        } else {
          throw new UnauthorizedException('Invalid credentials');
        }
      } else {
        const isValid = await bcrypt.compare(body.password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');
      }
    } else {
      throw new UnauthorizedException('Email and password required');
    }

    const sessionToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + (body.rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 60 * 24));

    await this.prisma.userSession.create({
      data: { userId: user.id, token: sessionToken, expiresAt },
    });

    return {
      token: sessionToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async register(body: { name: string; email: string; password: string; inviteCode: string }): Promise<{ token: string; user: AuthUser }> {
    const validInviteCode = process.env.INVITE_CODE ?? process.env.ADMIN_TOKEN;
    
    if (!validInviteCode || body.inviteCode !== validInviteCode) {
      throw new UnauthorizedException('Invalid invite code');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hash = await bcrypt.hash(body.password, 10);
    
    const user = await this.prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash: hash,
        role: 'operator',
        active: true,
      },
    });

    const sessionToken = randomBytes(48).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await this.prisma.userSession.create({
      data: { userId: user.id, token: sessionToken, expiresAt },
    });

    return {
      token: sessionToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  async me(userId: string): Promise<unknown> {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
    });
  }

  async logout(token: string): Promise<{ ok: true }> {
    await this.prisma.userSession.deleteMany({ where: { token } });
    await this.redis.del(`session:${token}`);
    return { ok: true };
  }
}