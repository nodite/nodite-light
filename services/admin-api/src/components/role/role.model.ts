import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  Comment,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import MenuModel from '@/components/menu/menu.model';
import RoleMenuModel from '@/components/role/role_menu.model';
import RoleUserModel from '@/components/role/role_user.model';
import UserModel from '@/components/user/user.model';
import RoleSeeds from '@/seeds/sys_role.json';

const TABLE_NAME = 'sys_role';

/**
 * Class RoleModel.
 */
@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@SequelizeDatabase.subscribe(RoleSeeds)
export default class RoleModel extends SequelizeModel<RoleModel> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({ field: 'role_id', type: DataType.INTEGER })
  roleId: number;

  @AllowNull(false)
  @Comment('role name')
  @Column({ field: 'role_name', type: DataType.STRING(50) })
  roleName: string;

  @Unique
  @AllowNull(false)
  @Comment('role key')
  @Column({ field: 'role_key', type: DataType.STRING(100) })
  roleKey: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @BelongsToMany(() => MenuModel, {
    through: () => RoleMenuModel,
    foreignKey: { allowNull: false },
    constraints: false,
  })
  menus: MenuModel[];

  @BelongsToMany(() => UserModel, {
    through: () => RoleUserModel,
    foreignKey: { allowNull: false },
    constraints: false,
  })
  users: UserModel[];
}

export type IRole = Pick<
  InstanceType<typeof RoleModel>,
  | 'roleId'
  | 'roleName'
  | 'roleKey'
  | 'orderNum'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
