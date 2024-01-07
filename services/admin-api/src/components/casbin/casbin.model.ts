import { casbin } from '@nodite-light/admin-auth';
import { SequelizeDatabase } from '@nodite-light/admin-database';

import BaseModel from '@/components/base.model';
import CasbinSeeds from '@/seeds/sys_casbin.seeds.json';

/**
 * Class CasbinModel.
 */
export default class CasbinModel extends BaseModel {
  static readonly TABLE_NAME = 'sys_casbin';

  /**
   * Initial seeds.
   * @param model
   */
  @SequelizeDatabase.seeds(CasbinModel.TABLE_NAME)
  private static async seeds(): Promise<void> {
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
