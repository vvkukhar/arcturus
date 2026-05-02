import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateWatchlistItemDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsNumber()
  desiredBuyPrice?: number;

  @IsOptional()
  @IsNumber()
  maxBuyPrice?: number;

  @IsOptional()
  @IsNumber()
  targetSellPrice?: number | null;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  titleSnapshot?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsOptional()
  @IsString()
  notes?: string | null;

  @IsOptional()
  @IsString()
  assignedUserId?: string | null;
}