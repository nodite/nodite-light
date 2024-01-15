import { SequelizeModel, Subscription } from '@nodite-light/admin-database';
import { AllowNull, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';

import RoleModel, { IRole } from '@/components/role/role.model';
import UserModel, { IUser } from '@/components/user/user.model';
import RoleUserSeeds from '@/seeds/sys_role_user.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_role_user',
})
@Subscription(RoleUserSeeds)
export default class RoleUserModel extends SequelizeModel<RoleUserModel> {
  @ForeignKey(() => RoleModel)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: 'role_id', type: DataType.BIGINT({ length: 20 }) })
  roleId: number;

  @ForeignKey(() => UserModel)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.BIGINT({ length: 20 }) })
  userId: number;
}

export type IRoleWithUsers = IRole & { users: IUser[] };

export type IUserWithRoles = IUser & { roles: IRole[] };