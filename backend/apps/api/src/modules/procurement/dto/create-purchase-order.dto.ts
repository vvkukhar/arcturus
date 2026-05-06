import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreatePurchaseOrderDto {
  @IsString()
  itemId!: string;

  @IsOptional()
  @IsString()
  watchlistItemId?: string | null;

  @IsOptional()
  @IsString()
  assignedUserId?: string | null;

  @IsString()
  titleSnapshot!: string;

  @IsOptional()
  @IsString()
  sourceCode?: string | null;

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