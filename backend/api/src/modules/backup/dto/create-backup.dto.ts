import { IsOptional, IsString } from 'class-validator';

export class CreateBackupDto {
  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  notes?: string | null;
}