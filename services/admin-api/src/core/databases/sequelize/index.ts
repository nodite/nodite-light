import path from 'node:path';
import { exit } from 'node:process';

import { SequelizeStoreOptions } from '@core/databases/sequelize/interface';
import logger from '@core/utils/logger';
import { sync } from 'glob';
import { Sequelize } from 'sequelize';

// eslint-disable-next-line import/no-mutable-exports
let sequelize: Sequelize;

export default class Database {
  async connect(options: SequelizeStoreOptions): Promise<Sequelize | null> {
    const {
      host = 'localhost',
      port = 3306,
      user = 'root',
      pass = 'nodite',
      dbName = 'nodite',
    } = options;

    // for sqlite engines
    let { engine = 'memory', storagePath = '' } = options;

    engine = engine.toLowerCase();

    try {
      switch (engine) {
        case 'sqlite':
          storagePath = storagePath.trim();

          if (storagePath.length === 0) {
            throw new Error(
              'The "storagePath" must be specified when using the "sqlite" engine',
            );
          }

          sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: `${storagePath}/${dbName}.sqlite`,
            logging: (sql: string) => logger.debug(sql),
          });
          break;

        case 'mariadb':
        case 'mssql':
        case 'mysql':
        case 'postgres':
          sequelize = new Sequelize({
            host,
            port,
            database: dbName,
            dialect: engine,
            username: user,
            password: pass,
            logging: (sql: string) => logger.debug(sql),
          });
          break;

        case 'memory':
        default:
          engine = 'in:memory';
          sequelize = new Sequelize('sqlite::memory:', {
            logging: (sql: string) => logger.debug(sql),
          });
          break;
      }

      await sequelize.authenticate();

      logger.info(`Successfully connected to "${engine}" database server`);

      logger.info('Loading models...');

      const models = sync('src/components/**/*.model.ts', {
        ignore: ['src/components/base.model.ts'],
      });

      await Promise.all(
        models.map(async (file) => {
          logger.debug(`found model: ${file}`);
          const model = await import(path.resolve(file));
          await model.init(sequelize);
        }),
      );

      logger.info('successfully loaded models');
    } catch (err) {
      logger.error(`Failed to connect to ${engine} server: ${err}`);
      exit(1);
    }

    return sequelize;
  }

  async disconnect() {
    await sequelize.close();
  }
}

export { sequelize };
