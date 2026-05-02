import { IsOptional, IsString } from 'class-validator';

export class CreateAuditLogDto {
  @IsOptional()
  @IsString()
  actorUserId?: string | null;

  @IsString()
  action!: string;

  @IsString()
  entityType!: string;

  @IsOptional()
  @IsString()
  entityId?: string | null;

  @IsOptional()
  beforeJson?: unknown;

  @IsOptional()
  afterJson?: unknown;

  @IsOptional()
  @IsString()
  ipAddress?: string | null;

  @IsOptional()
  @IsString()
  userAgent?: string | null;
}