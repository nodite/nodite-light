import { exit } from 'node:process';

import logger from '@nodite-light/admin-core/lib/utils/logger';
import { Sequelize } from 'sequelize';

import {
  ModelInitialFunction,
  ModelRegister,
  SequelizeStoreOptions,
} from '@/nodite-sequelize/interface';

export class Database {
  static client: Sequelize | null;

  static modelRegisters: ModelRegister[] = [];

  /**
   * Decorator for registering a model
   * @param tableName
   * @returns
   */
  static register(tableName: string) {
    return (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) => {
      const fn = descriptor.value;
      Database.modelRegisters.push({
        tableName,
        fn: fn as ModelInitialFunction,
      });
    };
  }

  /**
   * Connect to the database
   * @param options
   * @returns
   */
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
            throw new Error('The "storagePath" must be specified when using the "sqlite" engine');
          }

          Database.client = new Sequelize({
            dialect: 'sqlite',
            storage: `${storagePath}/${dbName}.sqlite`,
            logging: (sql: string) => logger.debug(sql),
          });
          break;

        case 'mariadb':
        case 'mssql':
        case 'mysql':
        case 'postgres':
          Database.client = new Sequelize({
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
          Database.client = new Sequelize('sqlite::memory:', {
            logging: (sql: string) => logger.debug(sql),
          });
          break;
      }

      await Database.client.authenticate();

      logger.info(`Successfully connected to "${engine}" database server`);

      logger.info('Loading models...');

      await Promise.all(
        Database.modelRegisters.map(async (register) => {
          logger.debug(`found model: ${register.tableName}`);
          await register.fn(Database.client as Sequelize);
        }),
      );

      logger.info('Successfully loaded models');
    } catch (err) {
      logger.error(`Failed to connect to ${engine} server: ${err}`);
      exit(1);
    }

    return Database.client;
  }

  /**
   * Disconnect from the database
   */
  async disconnect() {
    await Database.client?.close();
  }
}

export default {};
