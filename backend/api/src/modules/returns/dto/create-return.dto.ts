import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateReturnDto {
  @IsString()
  saleId!: string;

  @IsOptional()
  @IsString()
  orderId?: string | null;

  @IsOptional()
  @IsString()
  reason?: string | null;

  @IsOptional()
  @IsNumber()
  refundAmount?: number | null;

  @IsOptional()
  @IsBoolean()
  restock?: boolean;

  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsString()
  adminNote?: string | null;
}