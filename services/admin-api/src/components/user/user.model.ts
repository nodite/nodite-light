import { AppError } from '@nodite-light/admin-core';
import { SequelizeDatabase } from '@nodite-light/admin-database';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Sequelize } from 'sequelize';

import BaseModel from '@/components/base.model';
import TableSchema from '@/components/user/user.schema';
import UserSeeds from '@/seeds/sys_user.seeds.json';

/**
 * Class UserModel.
 */
export default class UserModel extends BaseModel {
  static readonly TABLE_NAME = 'sys_user';

  public skipBcryptPassword = false;

  /**
   * register.
   * @param sequelize
   */
  @SequelizeDatabase.register(UserModel.TABLE_NAME)
  private static async register(sequelize: Sequelize): Promise<typeof UserModel> {
    return UserModel.init(TableSchema, {
      ...UserModel.BaseInitOptions,
      sequelize,
      tableName: UserModel.TABLE_NAME,
      hooks: {
        beforeBulkCreate(instances) {
          instances.forEach((instance) => {
            instance.bcryptPassword();
          });
        },
        beforeCreate: (instance) => {
          instance.bcryptPassword();
        },
        beforeUpdate: (instance) => {
          instance.bcryptPassword();
        },
      },
    });
  }

  /**
   * Initial seeds.
   * @param model
   */
  @SequelizeDatabase.seeds(UserModel.TABLE_NAME)
  private static async seeds(model: typeof UserModel): Promise<void> {
    await model.bulkCreate(UserSeeds);
  }

  /**
   * bcryptPassword.
   * @returns
   */
  bcryptPassword(): void {
    if (this.skipBcryptPassword) return;
    const salt = bcrypt.genSaltSync(10, 'a');
    const pass = this.getDataValue('password');
    if (!pass) return;
    this.setDataValue('password', bcrypt.hashSync(this.getDataValue('password'), salt));
  }

  /**
   * validPassword.
   * @param rawPassword
   * @param encodedPassword
   * @returns
   */
  static validPassword(rawPassword: string, encodedPassword: string): boolean {
    if (!bcrypt.compareSync(rawPassword, encodedPassword)) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
    }
    return true;
  }
}
