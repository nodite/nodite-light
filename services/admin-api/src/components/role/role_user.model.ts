import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import { AllowNull, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';

import RoleModel, { IRole } from '@/components/role/role.model';
import UserModel, { IUser } from '@/components/user/user.model';
import RoleUserSeeds from '@/seeds/sys_role_user.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_role_user',
})
@SequelizeDatabase.subscribe(RoleUserSeeds)
export default class RoleUserModel extends SequelizeModel<RoleUserModel> {
  @PrimaryKey
  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column({ field: 'role_id', type: DataType.INTEGER })
  roleId: number;

  @PrimaryKey
  @ForeignKey(() => UserModel)
  @AllowNull(false)
  @Column({ field: 'user_id', type: DataType.INTEGER })
  userId: number;
}

export interface IRoleWithUsers extends IRole {
  users: IUser[];
}

export interface IUserWithRoles extends IUser {
  roles: IRole[];
}
