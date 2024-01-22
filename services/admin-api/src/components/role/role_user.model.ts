import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import { AllowNull, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';

import RoleModel, { IRole } from '@/components/role/role.model';
import UserModel, { IUser } from '@/components/user/user.model';
import RoleUserSeeds from '@/seeds/sys_role_user.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_role_user',
})
@Subscribe(RoleUserSeeds)
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

export interface IRoleWithUsers extends IRole {
  users: IUser[];
}

export interface IUserWithRoles extends IUser {
  roles: IRole[];
}
