import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class CollaborationUser extends Model {
  declare id: string;
  declare name: string;
  declare role: string;
}

CollaborationUser.init(
  {
    id: { type: DataTypes.STRING, primaryKey: true },
    name: DataTypes.STRING,
    role: DataTypes.STRING,
  },
  { sequelize, tableName: 'collaboration_users' }
);