import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class Sale extends Model {
  declare id: string;
  declare catalogItemId: string;
  declare profit: number;
  declare salePrice: number;
}

Sale.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    catalogItemId: DataTypes.STRING,
    profit: DataTypes.FLOAT,
    salePrice: DataTypes.FLOAT,
  },
  { sequelize, tableName: 'sales' }
);