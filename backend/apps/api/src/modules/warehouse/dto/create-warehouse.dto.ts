import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  address?: string | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}