import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateInventoryItemDto {
  @ApiProperty()
  @IsString()
  itemId!: string;

  @ApiProperty()
  @IsString()
  titleSnapshot!: string;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  purchasePrice!: number;

  @ApiPropertyOptional({ example: 1350 })
  @IsOptional()
  @IsNumber()
  totalCost?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional({ example: 'used' })
  @IsOptional()
  @IsString()
  condition?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  sealed?: boolean;

  @ApiPropertyOptional({ example: 2000 })
  @IsOptional()
  @IsNumber()
  expectedSalePriceManual?: number | null;

  @ApiPropertyOptional({ example: 'olx' })
  @IsOptional()
  @IsString()
  source?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  purchaseUrl?: string | null;

  @ApiPropertyOptional({ example: 'Shelf A1' })
  @IsOptional()
  @IsString()
  storageLocation?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedUserId?: string | null;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;
}