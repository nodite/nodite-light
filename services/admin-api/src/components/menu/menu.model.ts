import { SequelizeModel, Subscription } from '@nodite-light/admin-database';
import { Attributes, FindOptions } from 'sequelize';
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

import RoleModel from '@/components/role/role.model';
import RoleMenuModel from '@/components/role_menu/role_menu.model';
import MenuSeeds from '@/seeds/sys_menu.seeds.json';

const TABLE_NAME = 'sys_menu';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@Subscription(MenuSeeds)
export default class MenuModel extends SequelizeModel<MenuModel> {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'menu_id', type: DataType.BIGINT({ length: 20 }) })
  menuId: number;

  @AllowNull(false)
  @Comment('menu title')
  @Column({ field: 'menu_name', type: DataType.STRING(50) })
  menuName: string;

  @Default(0)
  @Column({ field: 'parent_id', type: DataType.BIGINT({ length: 20 }) })
  parentId: number;

  @Default(0)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @Default('')
  @Column(DataType.STRING(100))
  icon: string;

  @Comment('i18n key')
  @Column({ field: 'i_key', type: DataType.STRING(100) })
  iKey: string;

  @Default('')
  @Comment('menu type: overline, directory, menu, action')
  @Column({ field: 'i_type', type: DataType.STRING(32) })
  iType: string;

  @Default('')
  @Column(DataType.STRING(200))
  path: string;

  @Default('')
  @Column(DataType.STRING(200))
  redirect: string;

  @Default('')
  @Column(DataType.STRING(255))
  component: string;

  @Default(0)
  @Comment('0: show, 1: hidden')
  @Column(DataType.TINYINT({ length: 1 }))
  hidden: 0 | 1;

  @Default('')
  @Column(DataType.STRING(32))
  layout: string;

  @Default('')
  @Column(DataType.STRING(100))
  perms: string;

  @BelongsToMany(() => RoleModel, {
    through: () => RoleMenuModel,
    foreignKey: { allowNull: false },
    constraints: false,
  })
  roles: RoleModel[];

  /**
   * findAllByUserId.
   * @param userId
   * @returns
   */
  public static findAllByUserId(
    userId?: number,
    options?: FindOptions<Attributes<MenuModel>>,
  ): Promise<MenuModel[]> {
    if (!userId) return Promise.resolve([]);
    // TODO: user permission
    return this.findAll<MenuModel>(options);
  }
}

export type IMenu = Pick<
  InstanceType<typeof MenuModel>,
  | 'menuId'
  | 'menuName'
  | 'parentId'
  | 'orderNum'
  | 'icon'
  | 'iKey'
  | 'iType'
  | 'path'
  | 'redirect'
  | 'component'
  | 'hidden'
  | 'layout'
  | 'perms'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
