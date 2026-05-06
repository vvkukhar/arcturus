import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateReturnDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  status?: string;

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