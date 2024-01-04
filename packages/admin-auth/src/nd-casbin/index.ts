import { config } from '@nodite-light/admin-core';
import { Enforcer, newEnforcer } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

import Model from '@/nd-casbin/model';

export default async (): Promise<Enforcer> => {
  const adapter = await SequelizeAdapter.newAdapter(
    {
      username: config.dbUser,
      password: config.dbPass,
      database: config.dbName,
      tableName: 'sys_casbin',
      dialect: config.dbEngine,
    },
    true,
  );
  return newEnforcer(Model, adapter);
};
