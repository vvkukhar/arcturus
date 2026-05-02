import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(dto: CreateAuditLogDto): Promise<unknown> {
    return this.prisma.auditLog.create({
      data: {
        actorUserId: dto.actorUserId ?? null,
        action: dto.action,
        entityType: dto.entityType,
        entityId: dto.entityId ?? null,
        beforeJson: dto.beforeJson ?? undefined,
        afterJson: dto.afterJson ?? undefined,
        ipAddress: dto.ipAddress ?? null,
        userAgent: dto.userAgent ?? null,
      },
      include: {
        actor: true,
      },
    });
  }

  async list(params?: {
    actorUserId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    limit?: number;
  }): Promise<unknown[]> {
    return this.prisma.auditLog.findMany({
      where: {
        ...(params?.actorUserId ? { actorUserId: params.actorUserId } : {}),
        ...(params?.action ? { action: params.action } : {}),
        ...(params?.entityType ? { entityType: params.entityType } : {}),
        ...(params?.entityId ? { entityId: params.entityId } : {}),
      },
      include: {
        actor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: params?.limit ?? 200,
    });
  }

  async entityTrail(entityType: string, entityId: string): Promise<unknown[]> {
    return this.prisma.auditLog.findMany({
      where: {
        entityType,
        entityId,
      },
      include: {
        actor: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 200,
    });
  }
}