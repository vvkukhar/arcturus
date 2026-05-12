import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService
  ) {}

  public hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  async register(dto: RegisterDto): Promise<{ token: string; user: any }> {
    if (dto.inviteCode !== (process.env.ADMIN_INVITE_CODE || 'arcturus-init')) {
      throw new BadRequestException('Invalid invite code');
    }

    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: { name: dto.name, email: dto.email, passwordHash: hashedPassword, role: 'operator', active: true },
    });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await this.prisma.userSession.create({ data: { userId: user.id, tokenHash, expiresAt } });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(dto: LoginDto): Promise<{ token: string; user: any }> {
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

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(token);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (dto.rememberMe ? 30 : 1));

    await this.prisma.userSession.create({ data: { userId: user.id, tokenHash, expiresAt } });

    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async logout(token: string): Promise<void> {
    if (!token) return;
    const tokenHash = this.hashToken(token);
    await this.prisma.userSession.deleteMany({ where: { tokenHash } });
    await this.redis.del(`session:${tokenHash}`);
  }

  async invalidateUserSessions(userId: string): Promise<void> {
    const sessions = await this.prisma.userSession.findMany({ where: { userId } });
    for (const session of sessions) {
      await this.redis.del(`session:${session.tokenHash}`);
    }
    await this.prisma.userSession.deleteMany({ where: { userId } });
  }
}