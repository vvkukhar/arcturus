import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../lib/sequelize';

export class User extends Model {
  id!: string;
  name!: string;
  email!: string;
  passwordHash!: string;
  role!: 'admin' | 'operator';
  createdAt!: Date;
  updatedAt!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'operator'),
      defaultValue: 'operator',
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);