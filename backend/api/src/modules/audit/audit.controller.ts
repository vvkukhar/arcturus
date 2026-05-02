import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AuditService } from './audit.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  list(
    @Query('actorUserId') actorUserId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('limit') limit?: string,
  ): Promise<unknown[]> {
    return this.auditService.list({
      actorUserId,
      action,
      entityType,
      entityId,
      limit: limit ? Number(limit) : 200,
    });
  }

  @Get('entity/:entityType/:entityId')
  entityTrail(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ): Promise<unknown[]> {
    return this.auditService.entityTrail(entityType, entityId);
  }
}