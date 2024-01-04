import { casbin } from '@nodite-light/admin-auth';
import { SequelizeDatabase } from '@nodite-light/admin-database';

import BaseModel from '@/components/base.model';
import TableSchema from '@/components/role/role.schema';
import CasbinSeeds from '@/seeds/sys_casbin.seeds.json';
import RoleSeeds from '@/seeds/sys_role.seeds.json';

/**
 * Class RoleModel.
 */
export default class RoleModel extends BaseModel {
  static readonly TABLE_NAME = 'sys_role';

  /**
   * Register.
   * @param sequelize
   * @returns
   */
  @SequelizeDatabase.register(RoleModel.TABLE_NAME)
  private static async register(sequelize): Promise<typeof RoleModel> {
    return RoleModel.init(TableSchema, {
      ...RoleModel.BaseInitOptions,
      sequelize,
      tableName: RoleModel.TABLE_NAME,
    });
  }

  /**
   * Initial seeds.
   * @param model
   */
  @SequelizeDatabase.seeds(RoleModel.TABLE_NAME)
  private static async seeds(model: typeof RoleModel): Promise<void> {
    await model.bulkCreate(RoleSeeds);
    const enforcer = await casbin();

    await Promise.all([
      ...CasbinSeeds.policy.map((policy) => {
        return enforcer.addNamedPolicies(policy.key, policy.value);
      }),
      ...CasbinSeeds.group.map((group) => {
        return enforcer.addNamedGroupingPolicies(group.key, group.value);
      }),
    ]);
  }
}
