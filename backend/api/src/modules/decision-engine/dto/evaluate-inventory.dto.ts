import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EvaluateInventoryDto {
  @IsString()
  inventoryItemId!: string;

  @IsOptional()
  @IsNumber()
  targetRoiPercent?: number;
}