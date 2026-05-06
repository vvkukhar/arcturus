import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateStorageLocationDto {
  @IsString()
  warehouseId!: string;

  @IsString()
  code!: string;

  @IsString()
  name!: string;

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