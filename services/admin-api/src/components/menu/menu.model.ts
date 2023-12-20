import { BaseModel } from '@components/base.model';
import type { MenuTree } from '@components/menu/_iac/menu.interface';
import { TableSchema } from '@components/menu/_iac/menu.schema';
import MenuSeeds from '@components/menu/_iac/menu.seeds.json';
import { Database } from '@nodite-light/admin-database/lib/nodite-sequelize';
import lodash from 'lodash';
import { Attributes, FindOptions, Model, ModelStatic } from 'sequelize';

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
export class MenuModel extends BaseModel {
  static TABLE_NAME = 'sys_menu';

  /**
   * register.
   * @param sequelize
   * @returns
   */
  @Database.register(MenuModel.TABLE_NAME)
  private static async register(sequelize) {
    const model = MenuModel.init(TableSchema, {
      ...MenuModel.BaseInitOptions,
      sequelize,
      tableName: MenuModel.TABLE_NAME,
    });

    if (!(await model.exists())) {
      await model.sync();
      await initialSeeds(model, MenuSeeds as unknown as MenuTree[]);
    }

    return MenuModel;
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

export default {};
