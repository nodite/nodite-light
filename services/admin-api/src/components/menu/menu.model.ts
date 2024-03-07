import { type DataTree } from '@nodite-light/admin-core';
import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import { Attributes, FindOptions } from 'sequelize';
import {
  AllowNull,
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
import RoleMenuModel from '@/components/role/role_menu.model';
import MenuSeeds from '@/seeds/sys_menu.json';
import lodash from '@/utils/lodash';

const TABLE_NAME = 'sys_menu';

/**
 * Seeds handler.
 * @param model
 * @param seeds
 * @param parentId
 */
async function initialSeeds(model: typeof MenuModel, seeds: DataTree<IMenu>[] = [], parentId = '') {
  lodash.forEach(seeds, async (seed, idx) => {
    const menu = await model.create({
      ...seed,
      parentId,
      orderNum: idx,
    });

    if (lodash.isEmpty(seed.children)) return;

    await initialSeeds(model, seed.children, menu.getDataValue('menuId'));
  });
}

@Table({
  ...SequelizeModel.TableOptions,
  tableName: TABLE_NAME,
})
@SequelizeDatabase.subscribe(MenuSeeds, initialSeeds)
export default class MenuModel extends SequelizeModel<MenuModel> {
  @Unique
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ field: 'menu_id', type: DataType.UUID })
  menuId: string;

  @AllowNull(false)
  @Comment('menu title')
  @Column({ field: 'menu_name', type: DataType.STRING(50) })
  menuName: string;

  @Default('')
  @AllowNull(false)
  @Column({ field: 'parent_id', type: DataType.UUID })
  parentId: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(100))
  icon: string;

  @Default('')
  @AllowNull(false)
  @Comment('menu type: overline, directory, menu, action')
  @Column({ field: 'i_type', type: DataType.STRING(50) })
  iType: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(100))
  path: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(100))
  redirect: string;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(100))
  component: string;

  @Default(0)
  @AllowNull(false)
  @Comment('0: show, 1: hidden')
  @Column(DataType.TINYINT({ length: 1 }))
  hidden: 0 | 1;

  @Default('')
  @AllowNull(false)
  @Column(DataType.STRING(50))
  layout: string;

  @Default('')
  @AllowNull(false)
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
