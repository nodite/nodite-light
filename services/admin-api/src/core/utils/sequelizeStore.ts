import { exit } from 'node:process';

import logger from '@core/utils/logger';
import { Sequelize } from 'sequelize';

let db: Sequelize;

interface SequelizeStoreOptions {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  dbName?: string;
  engine?: string;
  storagePath?: string;
  exitOnFail?: boolean;
}

const logging = (sql: string) => {
  logger.debug(sql);
};

export class SequelizeStore {
  async connect(options: SequelizeStoreOptions): Promise<Sequelize | null> {
    let sequelize: Sequelize;

    const {
      host = 'localhost',
      port = 3306,
      user = 'root',
      pass = 'nodite',
      dbName = 'nodite',
      exitOnFail = true,
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
            logging,
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
            logging,
          });
          break;

        case 'memory':
        default:
          engine = 'in:memory';
          sequelize = new Sequelize('sqlite::memory:', {
            logging,
          });
          break;
      }

      await sequelize.authenticate();

      db = sequelize;

      logger.info(`Successfully connected to "${engine}" database server`);

      return db;
    } catch (err) {
      logger.error(`Failed to connect to ${engine} server: ${err}`);

      if (exitOnFail) {
        exit(1);
      }
    }

    return null;
  }

  async disconnect() {
    await db.close();
  }
}

export function getDB(): Sequelize {
  return db;
}

export default SequelizeStore;
