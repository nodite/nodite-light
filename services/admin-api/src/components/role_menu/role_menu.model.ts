import { SequelizeModel, Subscription } from '@nodite-light/admin-database';
import { AllowNull, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';

import MenuModel from '@/components/menu/menu.model';
import RoleModel from '@/components/role/role.model';
import RoleMenuSeeds from '@/seeds/sys_role_menu.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_role_menu',
})
@Subscription(RoleMenuSeeds)
export default class RoleMenuModel extends SequelizeModel<RoleMenuModel> {
  @ForeignKey(() => RoleModel)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: 'role_id', type: DataType.BIGINT({ length: 20 }) })
  roleId: number;

  @ForeignKey(() => MenuModel)
  @PrimaryKey
  @AllowNull(false)
  @Column({ field: 'menu_id', type: DataType.BIGINT({ length: 20 }) })
  menuId: number;

  /**
   * Check if the role has full permissions.
   * @param roleId
   * @returns
   */
  public static async hasFullPerms(roleId: number): Promise<boolean> {
    const count = await this.count({ where: { roleId, menuId: 0 } });
    return count > 0;
  }
}
