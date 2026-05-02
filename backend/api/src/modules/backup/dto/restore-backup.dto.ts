import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class RestoreBackupDto {
  @IsString()
  backupSnapshotId!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}