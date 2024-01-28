import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import { AllowNull, Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';

import MenuModel, { IMenu } from '@/components/menu/menu.model';
import RoleModel, { IRole } from '@/components/role/role.model';
import RoleMenuSeeds from '@/seeds/sys_role_menu.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_role_menu',
})
@Subscribe(RoleMenuSeeds)
export default class RoleMenuModel extends SequelizeModel<RoleMenuModel> {
  @PrimaryKey
  @ForeignKey(() => RoleModel)
  @AllowNull(false)
  @Column({ field: 'role_id', type: DataType.INTEGER })
  roleId: number;

  @PrimaryKey
  @ForeignKey(() => MenuModel)
  @AllowNull(false)
  @Column({ field: 'menu_id', type: DataType.UUID })
  menuId: string;

  /**
   * Check if the role has full permissions.
   * @param roleId
   * @returns
   */
  public static async hasFullPerms(roleId: number): Promise<boolean> {
    const count = await this.count({ where: { roleId, menuId: '*' } });
    return count > 0;
  }
}

export interface IRoleWithMenus extends IRole {
  menus: IMenu[];
}

export interface IMenuWithRoles extends IMenu {
  roles: IRole[];
}
