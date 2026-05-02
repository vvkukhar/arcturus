import { IsOptional, IsString } from 'class-validator';

export class ExecuteDecisionDto {
  @IsString()
  decisionSnapshotId!: string;

  @IsOptional()
  @IsString()
  note?: string | null;
}