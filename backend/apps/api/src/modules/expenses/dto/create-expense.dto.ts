import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  type!: string;

  @IsString()
  category!: string;

  @IsNumber()
  amount!: number;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsString()
  inventoryItemId?: string | null;

  @IsOptional()
  @IsString()
  purchaseOrderId?: string | null;

  @IsOptional()
  @IsString()
  saleId?: string | null;

  @IsOptional()
  @IsString()
  orderId?: string | null;

  @IsOptional()
  @IsString()
  assignedUserId?: string | null;

  @IsOptional()
  @IsDateString()
  incurredAt?: string;
}