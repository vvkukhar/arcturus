import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ example: 'LEGO Ninjago 70621 The Vermillion Attack' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: '70621' })
  @IsOptional()
  @IsString()
  setNumber?: string | null;

  @ApiPropertyOptional({ example: 'Ninjago' })
  @IsOptional()
  @IsString()
  theme?: string | null;

  @ApiPropertyOptional({ example: 'set', enum: ['set', 'minifigure', 'bundle', 'unknown'] })
  @IsOptional()
  @IsString()
  kind?: string;

  @ApiPropertyOptional({ example: 'used' })
  @IsOptional()
  @IsString()
  conditionDefault?: string | null;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg' })
  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @ApiPropertyOptional({ example: 'Rare Ninjago set' })
  @IsOptional()
  @IsString()
  notes?: string | null;
}