import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

export type AuthUser = Pick<User, 'id' | 'name' | 'email' | 'role' | 'isPro' | 'proExpiresAt' | 'apiKey' | 'apiTier'>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  public extractBearerToken(header?: string): string | null {
    if (!header) return null;
    const [type, token] = header.split(' ');
    return type === 'Bearer' && token ? token : null;
  }

  async validateToken(tokenRaw: string): Promise<AuthUser> {
    const tokenHash = this.hashToken(tokenRaw);
    const session = await this.prisma.userSession.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!session || !session.user.active || (session.expiresAt && session.expiresAt.getTime() < Date.now())) {
      throw new UnauthorizedException('Session expired or invalid');
    }
    
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role,
      isPro: session.user.isPro,
      proExpiresAt: session.user.proExpiresAt,
      apiKey: session.user.apiKey,
      apiTier: session.user.apiTier,
    };
  }

  async register(dto: RegisterDto): Promise<{ token: string; user: AuthUser }> {
    const adminCode = process.env.ADMIN_INVITE_CODE || 'arcturus-init';
    
    let role = 'viewer';
    let referredById: string | null = null;
    let initialPoints = 500;

    if (dto.inviteCode && dto.inviteCode.trim() !== '') {
      if (dto.inviteCode === adminCode) {
        role = 'operator';
        initialPoints = 0;
      } else {
        const referrer = await this.prisma.user.findUnique({
          where: { referralCode: dto.inviteCode }
        });
        
        if (!referrer) {
          throw new BadRequestException('Invalid invite or referral code');
        }
        referredById = referrer.id;
        initialPoints = 1000;
      }
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    
    const user = await this.prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { 
          name: dto.name, 
          email: dto.email, 
          passwordHash: hashedPassword, 
          role, 
          active: true,
          points: initialPoints,
          referredById
        },
      });

      if (initialPoints > 0) {
        await tx.pointTransaction.create({
          data: {
            userId: newUser.id,
            amount: initialPoints,
            type: 'earn',
            description: referredById ? 'Syndicate Referral Welcome Bonus' : 'Welcome to Arcturus Bonus'
          }
        });
      }

      return newUser;
    });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await this.prisma.userSession.create({ data: { userId: user.id, tokenHash, expiresAt } });

    return { 
      token: rawToken, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isPro: user.isPro,
        proExpiresAt: user.proExpiresAt,
        apiKey: user.apiKey,
        apiTier: user.apiTier,
      } 
    };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: AuthUser }> {
    if (!dto.email || !dto.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.active || !user.passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + (dto.rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000);

    await this.prisma.userSession.create({ data: { userId: user.id, tokenHash, expiresAt } });

    return { 
      token: rawToken, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        isPro: user.isPro,
        proExpiresAt: user.proExpiresAt,
        apiKey: user.apiKey,
        apiTier: user.apiTier,
      } 
    };
  }

  async logout(rawToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawToken);
    await this.prisma.userSession.deleteMany({ where: { tokenHash } });
    await this.redis.del(`session:${tokenHash}`);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    const sessions = await this.prisma.userSession.findMany({ where: { userId } });
    const pipeline = this.redis.getClient().pipeline();
    
    for (const session of sessions) {
      pipeline.del(`session:${session.tokenHash}`);
    }
    
    await pipeline.exec();
    await this.prisma.userSession.deleteMany({ where: { userId } });
  }

  async updateProfile(userId: string, dto: { name?: string; email?: string; password?: string }): Promise<AuthUser> {
    const updateData: any = {};
    
    if (dto.name && dto.name.trim() !== '') {
      updateData.name = dto.name.trim();
    }
    
    if (dto.email && dto.email.trim() !== '') {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email.trim() } });
      if (existing && existing.id !== userId) {
        throw new BadRequestException('Email already in use by another account');
      }
      updateData.email = dto.email.trim();
    }
    
    if (dto.password && dto.password.trim() !== '') {
      updateData.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    await this.invalidateUserSessions(userId);

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      isPro: updatedUser.isPro,
      proExpiresAt: updatedUser.proExpiresAt,
      apiKey: updatedUser.apiKey,
      apiTier: updatedUser.apiTier,
    };
  }

  async generateApiKey(userId: string): Promise<{ apiKey: string; apiTier: string }> {
    const apiKey = `arc_live_${crypto.randomBytes(24).toString('hex')}`;
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { apiKey, apiTier: 'b2b' }
    });
    await this.invalidateUserSessions(userId);
    return { apiKey: user.apiKey!, apiTier: user.apiTier! };
  }
}