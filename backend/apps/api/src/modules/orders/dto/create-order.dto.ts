import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  reserveRequestId?: string | null;

  @IsOptional()
  @IsString()
  inventoryItemId?: string | null;

  @IsString()
  productTitle!: string;

  @IsString()
  buyerName!: string;

  @IsString()
  contact!: string;

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