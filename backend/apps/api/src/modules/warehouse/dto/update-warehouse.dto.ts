import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateWarehouseDto {
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
  address?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}