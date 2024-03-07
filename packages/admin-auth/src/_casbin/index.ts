import { config } from '@nodite-light/admin-core';
import { Enforcer, newEnforcer } from 'casbin';
import { SequelizeAdapter } from 'casbin-sequelize-adapter';

import Model from '@/_casbin/model';

export default async (): Promise<Enforcer> => {
  const adapter = await SequelizeAdapter.newAdapter(
    {
      host: config.dbHost,
      port: config.dbPort,
      username: config.dbUser,
      password: config.dbPass,
      database: config.dbName,
      tableName: 'sys_casbin',
      dialect: config.dbEngine,
      logging: config.env !== 'production',
    },
    true,
  );
  return newEnforcer(Model, adapter);
};
