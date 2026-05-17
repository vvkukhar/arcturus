import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateInventoryItemDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  titleSnapshot?: string;

  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  @IsString()
  theme?: string | null;

  @IsOptional()
  @IsString()
  setNumber?: string | null;

  @IsOptional()
  @IsNumber()
  purchasePrice?: number;

  @IsOptional()
  @IsNumber()
  shippingToMe?: number;

  @IsOptional()
  @IsNumber()
  extraCosts?: number;

  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsBoolean()
  sealed?: boolean;

  @IsOptional()
  @IsNumber()
  expectedSalePriceManual?: number | null;

  @IsOptional()
  @IsString()
  source?: string | null;

  @IsOptional()
  @IsString()
  purchaseUrl?: string | null;

  @IsOptional()
  @IsString()
  storageLocationId?: string | null;

  @IsOptional()
  @IsString()
  warehouseId?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsString()
  assignedUserId?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;
}