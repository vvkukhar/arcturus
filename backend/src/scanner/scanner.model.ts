import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export type ScannerJobStatus = 'queued' | 'running' | 'success' | 'failed';

export class ScannerJob extends Model {
  declare id: string;
  declare sourceCode: string;
  declare query: string | null;
  declare status: ScannerJobStatus;
}

ScannerJob.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    sourceCode: DataTypes.STRING,
    query: DataTypes.STRING,
    status: DataTypes.ENUM('queued', 'running', 'success', 'failed'),
  },
  { sequelize, tableName: 'scanner_jobs' }
);