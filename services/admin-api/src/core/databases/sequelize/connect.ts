import config from '@config/config';
import Sequelize from '@core/databases/sequelize';

new Sequelize().connect({
  host: config.dbHost,
  port: config.dbPort,
  user: config.dbUser,
  pass: config.dbPass,
  dbName: config.dbName,
  engine: config.dbEngine,
  exitOnFail: true,
});
