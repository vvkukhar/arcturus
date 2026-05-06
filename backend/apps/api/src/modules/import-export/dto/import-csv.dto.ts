import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class ImportCsvDto {
  @IsString()
  csv!: string;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}