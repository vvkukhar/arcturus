import { IsNumber, IsOptional, IsString } from 'class-validator';

export class EvaluateBuyDto {
  @IsString()
  itemId!: string;

  @IsOptional()
  @IsString()
  listingId?: string | null;

  @IsOptional()
  @IsNumber()
  buyPrice?: number | null;

  @IsOptional()
  @IsNumber()
  shippingPrice?: number | null;

  @IsOptional()
  @IsNumber()
  targetSellPrice?: number | null;
}