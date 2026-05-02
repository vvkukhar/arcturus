import { IsOptional, IsString } from 'class-validator';

export class UpdateItemDto {
  @IsString()
  id!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  setNumber?: string | null;

  @IsOptional()
  @IsString()
  theme?: string | null;

  @IsOptional()
  @IsString()
  kind?: string;

  @IsOptional()
  @IsString()
  conditionDefault?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  notes?: string | null;
}