import { AppError } from '@nodite-light/admin-core';
import { SequelizeModel, Subscription } from '@nodite-light/admin-database';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {
  AllowNull,
  AutoIncrement,
  BeforeBulkCreate,
  BeforeCreate,
  BeforeUpdate,
  Column,
  Comment,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';

import UserSeeds from '@/seeds/sys_user.seeds.json';

const TABLE_NAME = 'sys_user';

/**
 * Class UserModel.
 */
@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@Subscription(UserSeeds)
export default class UserModel extends SequelizeModel<UserModel> {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'user_id', type: DataType.BIGINT })
  userId: number;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING(32))
  username: string;

  @Column(DataType.STRING(32))
  nickname: string;

  @Unique
  @Validate({ isEmail: true })
  @Column(DataType.STRING(128))
  email: string;

  @Column(DataType.STRING(32))
  phone: string;

  @Default(0)
  @Comment('0 - secret, 1 - male, 2 - female.')
  @Column(DataType.TINYINT({ length: 1 }))
  sex: 0 | 1;

  @Column(DataType.STRING(255))
  avatar: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;

  @BeforeBulkCreate
  static bulkBcryptPassword(users: UserModel[]): void {
    users.forEach((user) => {
      user.bcryptPassword();
    });
  }

  @BeforeCreate
  @BeforeUpdate
  static singleBcryptPassword(user: UserModel): void {
    user.bcryptPassword();
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

export type IUser = Pick<
  InstanceType<typeof UserModel>,
  | 'userId'
  | 'username'
  | 'nickname'
  | 'email'
  | 'phone'
  | 'sex'
  | 'avatar'
  | 'password'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
