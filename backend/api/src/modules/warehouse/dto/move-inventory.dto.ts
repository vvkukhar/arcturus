import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class MoveInventoryDto {
  @IsString()
  inventoryItemId!: string;

  @IsOptional()
  @IsString()
  toStorageLocationId?: string | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  reason?: string | null;
}