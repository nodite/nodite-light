import { BaseModel } from '@components/base.model';
import { TableSchema } from '@components/user/_iac/user.schema';
import UserSeeds from '@components/user/_iac/user.seeds.json';
import AppError from '@nodite-light/admin-core/lib/utils/appError';
import { Database } from '@nodite-light/admin-database/lib/nodite-sequelize';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Sequelize } from 'sequelize';

/**
 * Class UserModel.
 */
export class UserModel extends BaseModel {
  static readonly TABLE_NAME = 'sys_user';

  /**
   * register.
   * @param sequelize
   */
  @Database.register(UserModel.TABLE_NAME)
  private static async register(sequelize: Sequelize) {
    const model = UserModel.init(TableSchema, {
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

    if (!(await model.exists())) {
      await model.sync();
      await model.bulkCreate(UserSeeds);
    }
  }

  public skipBcryptPassword = false;

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

export default {};
