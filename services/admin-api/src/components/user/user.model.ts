import { AppError } from '@nodite-light/admin-core';
import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import {
  AllowNull,
  AutoIncrement,
  BeforeBulkCreate,
  BeforeCreate,
  BeforeUpdate,
  BelongsToMany,
  Column,
  Comment,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
  Validate,
} from 'sequelize-typescript';

import RoleModel from '@/components/role/role.model';
import RoleUserModel from '@/components/role/role_user.model';
import UserSeeds from '@/seeds/sys_user.json';

const TABLE_NAME = 'sys_user';

/**
 * Class UserModel.
 */
@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@SequelizeDatabase.subscribe(UserSeeds)
export default class UserModel extends SequelizeModel<UserModel> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.BIGINT })
  userId: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(50))
  username: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(50))
  nickname: string;

  @Unique
  @Validate({ isEmail: true })
  @Column(DataType.STRING(100))
  email: string;

  @Column(DataType.STRING(50))
  phone: string;

  @Default(0)
  @AllowNull(false)
  @Comment('0 - secret, 1 - male, 2 - female.')
  @Column(DataType.TINYINT({ length: 1 }))
  sex: 0 | 1;

  @Column(DataType.STRING(255))
  avatar: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password: string;

  @BelongsToMany(() => RoleModel, {
    through: () => RoleUserModel,
    foreignKey: { allowNull: false },
    constraints: false,
  })
  roles: RoleModel[];

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
