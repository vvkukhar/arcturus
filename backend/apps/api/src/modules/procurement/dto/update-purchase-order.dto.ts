import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePurchaseOrderDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  assignedUserId?: string | null;

  @IsOptional()
  @IsString()
  supplierName?: string | null;

  @IsOptional()
  @IsString()
  sourceUrl?: string | null;

  @IsOptional()
  @IsNumber()
  plannedPrice?: number | null;

  @IsOptional()
  @IsNumber()
  actualPrice?: number | null;

  @IsOptional()
  @IsNumber()
  shippingPrice?: number | null;

  @IsOptional()
  @IsNumber()
  targetSellPrice?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsBoolean()
  sealed?: boolean;

  @IsOptional()
  @IsString()
  notes?: string | null;
}