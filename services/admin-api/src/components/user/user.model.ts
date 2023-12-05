import { BaseSchema } from '@components/base.model';
import AppError from '@core/utils/appError';
import logger from '@core/utils/logger';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { DataTypes, Model, ModelAttributeColumnOptions } from 'sequelize';

import { IUser } from './user.interface';

const TableSchema = {
  userId: {
    field: 'user_id',
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING(32),
    allowNull: false,
    unique: true,
  },
  nickname: {
    type: DataTypes.STRING(32),
  },
  email: {
    type: DataTypes.STRING(256),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  phone: {
    type: DataTypes.STRING(32),
  },
  sex: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  avatar: {
    type: DataTypes.STRING(256),
  },
  password: {
    type: DataTypes.STRING(256),
    allowNull: false,
  },
  ...BaseSchema,
} as Record<string, ModelAttributeColumnOptions>;

export class UserModel extends Model {
  bcryptPassword(): void {
    const salt = bcrypt.genSaltSync(10, 'a');
    const pass = this.getDataValue('password');
    if (!pass) return;
    this.setDataValue(
      'password',
      bcrypt.hashSync(this.getDataValue('password'), salt),
    );
  }

  validPassword(password: string): boolean {
    if (!bcrypt.compareSync(password, this.getDataValue('password'))) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
    }
    return true;
  }
}

export const init = async (sequelize) => {
  await UserModel.init(TableSchema, {
    sequelize,
    tableName: 'sys_user',
    omitNull: true,
    underscored: true,
    updatedAt: false,
    createdAt: false,
    hooks: {
      beforeCreate: (user) => {
        user.bcryptPassword();
      },
      beforeUpdate: (user) => {
        user.bcryptPassword();
      },
    },
  }).sync();

  logger.debug('Find or creating the admin user...');

  await UserModel.findOrCreate({
    where: { userId: 1 },
    defaults: {
      userId: 1,
      username: 'admin',
      email: 'nodite-light@example.com',
      password: 'admin',
    } as IUser as never,
  });

  return UserModel;
};
