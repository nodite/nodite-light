import { SequelizeDatabase } from '@nodite-light/admin-database';
import lodash from 'lodash';
import { Attributes, FindOptions, Model, ModelStatic } from 'sequelize';

import BaseModel from '@/components/base.model';
import type { MenuTree } from '@/components/menu/menu.interface';
import TableSchema from '@/components/menu/menu.schema';
import MenuSeeds from '@/seeds/sys_menu.seeds.json';

async function initialSeeds(model: typeof MenuModel, seeds: MenuTree[] = [], parentId = 0) {
  seeds.forEach(async (seed, idx) => {
    const menuInstance = await model.create({
      ...seed,
      parentId,
      orderNum: idx,
    });

    if (lodash.isEmpty(seed.children)) return;

    await initialSeeds(model, seed.children, menuInstance.getDataValue('menuId'));
  });
}

/**
 * Class MenuModel.
 */
export default class MenuModel extends BaseModel {
  static readonly TABLE_NAME = 'sys_menu';

  /**
   * register.
   * @param sequelize
   * @returns
   */
  @SequelizeDatabase.register(MenuModel.TABLE_NAME)
  private static async register(sequelize): Promise<typeof MenuModel> {
    return MenuModel.init(TableSchema, {
      ...MenuModel.BaseInitOptions,
      sequelize,
      tableName: MenuModel.TABLE_NAME,
    });
  }

  /**
   * Initial seeds.
   * @param model
   */
  @SequelizeDatabase.seeds(MenuModel.TABLE_NAME)
  private static async seeds(model: typeof MenuModel): Promise<void> {
    await initialSeeds(model, MenuSeeds as unknown as MenuTree[]);
  }

  /**
   * findAllByUserId.
   * @param userId
   * @returns
   */
  public static findAllByUserId<M extends Model>(
    this: ModelStatic<M>,
    userId?: number,
    options?: FindOptions<Attributes<M>>,
  ): Promise<M[]> {
    if (!userId) return Promise.resolve([]);
    // TODO: user permission
    return this.findAll<M>(options);
  }
}
