import { config } from '@nodite-light/admin-core';

import Redis from '@/nodite-redis';
import Sequelize from '@/nodite-sequelize';

Redis.connect({
  url: config.redisUrl,
  username: config.redisUser || undefined,
  password: config.redisPass || undefined,
}).then(() => {});

Sequelize.connect({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  pass: config.dbPass,
  dbName: config.dbName,
  engine: config.dbEngine,
  exitOnFail: true,
});
