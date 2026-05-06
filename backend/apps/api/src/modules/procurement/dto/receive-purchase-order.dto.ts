import { IsOptional, IsString } from 'class-validator';

export class ReceivePurchaseOrderDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  storageLocationId?: string | null;

  @IsOptional()
  @IsString()
  warehouseId?: string | null;
}