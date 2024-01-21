import { casbin, permToCasbinPolicy } from '@nodite-light/admin-auth';
import { Subscribe } from '@nodite-light/admin-database';
import { Enforcer } from 'casbin';
import { CasbinRule } from 'casbin-sequelize-adapter/lib/casbinRule';
import { Transaction } from 'sequelize';
import { Table } from 'sequelize-typescript';

import CasbinSeeds from '@/seeds/sys_casbin.seeds.json';

/**
 * Class CasbinModel.
 */
@Table({
  tableName: 'sys_casbin',
  timestamps: false,
})
@Subscribe(CasbinSeeds)
export default class CasbinModel extends CasbinRule {
  /**
   * Casbin enforcer.
   * @returns
   */
  public static async enforcer(): Promise<Enforcer> {
    return casbin();
  }

  /**
   * Remove role policies.
   * @param roleId
   * @returns
   */
  public static async removeRolePolicies(
    roleId: number,
    transaction?: Transaction,
  ): Promise<number> {
    return this.destroy({ where: { ptype: 'p', v0: `sys_role:${roleId}` }, transaction });
  }

  /**
   * Add role policies.
   * @param roleId
   * @param menuPerms
   * @param transaction
   * @returns
   */
  public static async addRolePolicies(
    roleId: number,
    menuPerms: string[],
    transaction?: Transaction,
  ): Promise<CasbinRule[]> {
    return this.bulkCreate(
      menuPerms.map((perm) => {
        const parts = permToCasbinPolicy(perm);
        return {
          ptype: 'p',
          v0: `sys_role:${roleId}`,
          v1: parts[0],
          v2: parts[1],
          v3: parts[2],
        };
      }),
      { transaction },
    );
  }

  /**
   * Assign roles to user.
   * @param roleIds
   * @param userId
   * @param transaction
   * @returns
   */
  public static async assignRolesToUser(
    roleIds: number[],
    userId: number,
    transaction?: Transaction,
  ): Promise<CasbinModel[]> {
    return this.bulkCreate(
      roleIds.map((roleId) => ({ ptype: 'g', v0: `sys_user:${userId}`, v1: `sys_role:${roleId}` })),
      { transaction },
    );
  }

  /**
   * Unassign roles of user.
   * @param roleIds
   * @param userId
   * @param transaction
   * @returns
   */
  public static async unassignRolesOfUser(
    roleIds: number[],
    userId: number,
    transaction?: Transaction,
  ): Promise<number> {
    const v1s = roleIds.map((roleId) => `sys_role:${roleId}`);
    return this.destroy({
      where: { ptype: 'g', v0: `sys_user:${userId}`, v1: v1s },
      transaction,
    });
  }
}

export type ICasbin = Pick<
  typeof CasbinModel.prototype,
  'id' | 'ptype' | 'v0' | 'v1' | 'v2' | 'v3' | 'v4' | 'v5'
>;
