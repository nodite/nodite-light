import { Subscription } from '@nodite-light/admin-database';
import { CasbinRule } from 'casbin-sequelize-adapter/lib/casbinRule';
import { Table } from 'sequelize-typescript';

import CasbinSeeds from '@/seeds/sys_casbin.seeds.json';

/**
 * Class CasbinModel.
 */
@Table({
  tableName: 'sys_casbin',
  timestamps: false,
})
@Subscription(CasbinSeeds)
export default class CasbinModel extends CasbinRule {}

export type ICasbin = Pick<
  typeof CasbinModel.prototype,
  'id' | 'ptype' | 'v0' | 'v1' | 'v2' | 'v3' | 'v4' | 'v5'
>;
