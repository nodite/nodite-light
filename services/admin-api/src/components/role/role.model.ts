import { SequelizeModel, Subscription } from '@nodite-light/admin-database';
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
import RoleMenuModel from '@/components/role_menu/role_menu.model';
import RoleSeeds from '@/seeds/sys_role.seeds.json';

const TABLE_NAME = 'sys_role';

/**
 * Class RoleModel.
 */
@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@Subscription(RoleSeeds)
export default class RoleModel extends SequelizeModel<RoleModel> {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'role_id', type: DataType.BIGINT({ length: 20 }) })
  roleId: number;

  @AllowNull(false)
  @Comment('role name')
  @Column({ field: 'role_name', type: DataType.STRING(50) })
  roleName: string;

  @AllowNull(false)
  @Unique
  @Comment('role key')
  @Column({ field: 'role_key', type: DataType.STRING(100) })
  roleKey: string;

  @Default(0)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @Comment('i18n key')
  @Column({ field: 'i_key', type: DataType.STRING(100) })
  iKey: string;

  @BelongsToMany(() => MenuModel, {
    through: () => RoleMenuModel,
    foreignKey: { allowNull: false },
    constraints: false,
  })
  menus: MenuModel[];
}

export type IRole = Pick<
  InstanceType<typeof RoleModel>,
  | 'roleId'
  | 'roleName'
  | 'roleKey'
  | 'orderNum'
  | 'iKey'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
