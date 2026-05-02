import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateStorageLocationDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  zone?: string | null;

  @IsOptional()
  @IsString()
  shelf?: string | null;

  @IsOptional()
  @IsString()
  box?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}