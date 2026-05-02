import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export type ProductCondition = 'new' | 'used' | 'sealed';
export type ProductStatus = 'available' | 'sold' | 'pending';

export class CatalogItem extends Model {
  declare id: string;
  declare slug: string;
  declare title: string;
  declare price: number;
  declare condition: ProductCondition;
  declare status: ProductStatus;
  declare type: string;
  declare theme: string | null;
  declare imageUrl: string | null;
}

CatalogItem.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    slug: { type: DataTypes.STRING, unique: true },
    title: DataTypes.STRING,
    price: DataTypes.FLOAT,
    condition: DataTypes.ENUM('new', 'used', 'sealed'),
    status: DataTypes.ENUM('available', 'sold', 'pending'),
    type: DataTypes.STRING,
    theme: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
  },
  { sequelize, tableName: 'catalog_items' }
);