import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateOrderDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  productTitle?: string;

  @IsOptional()
  @IsString()
  buyerName?: string;

  @IsOptional()
  @IsString()
  contact?: string;

  @IsOptional()
  @IsNumber()
  sellPrice?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  channel?: string | null;

  @IsOptional()
  @IsString()
  adminNote?: string | null;
}