import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class SuggestionItem extends Model {
  declare id: string;
  declare title: string;
  declare roi: number;
  declare action: string;
}

SuggestionItem.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    title: DataTypes.STRING,
    roi: DataTypes.FLOAT,
    action: DataTypes.STRING,
  },
  { sequelize, tableName: 'suggestion_items' }
);