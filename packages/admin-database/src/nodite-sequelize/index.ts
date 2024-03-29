import { exit } from 'node:process';

import { logger } from '@nodite-light/admin-core';
import lodash from 'lodash';
import { ModelCtor, Sequelize } from 'sequelize-typescript';

import { SequelizeStoreOptions } from '@/nodite-sequelize/interface';

type SeedsHandler = (model: ModelCtor, seeds: Array<object>) => void;

/**
 * Class Database.
 */
export default class Database {
  static client: Sequelize | null;

  static models: Array<{ model: ModelCtor; seeds: Array<object>; seedsHandler: SeedsHandler }> = [];

  /**
   * Subscribe to the database
   * @param seeds
   * @param seedsHandler
   * @returns
   */
  static subscribe(seeds?: Array<object>, seedsHandler?: SeedsHandler) {
    return (target: unknown) => {
      Database.models.push({
        model: target as ModelCtor,
        seeds,
        seedsHandler,
      });
    };
  }

  /**
   * Connect to the database
   * @param options
   * @returns
   */
  static async connect(options: SequelizeStoreOptions): Promise<Sequelize | null> {
    const { host, port, user, pass, dbName } = options;

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
            define: {
              charset: 'utf8',
              collate: 'utf8_general_ci',
            },
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
            define: {
              charset: 'utf8',
              collate: 'utf8_general_ci',
            },
            logging: (sql: string) => logger.debug(sql),
          });
          break;

        case 'memory':
        default:
          engine = 'in:memory';
          Database.client = new Sequelize('sqlite::memory:', {
            define: {
              charset: 'utf8',
              collate: 'utf8_general_ci',
            },
            logging: (sql: string) => logger.debug(sql),
          });
          break;
      }

      await Database.client.authenticate();

      logger.info(`Successfully connected to "${engine}" database server`);

      Database.client.addModels(lodash.map(Database.models, 'model'));
      await Database.client.sync();

      logger.info('Successfully synced models');

      await Promise.all(
        lodash.map(Database.models, async (meta) => {
          if (!meta.seeds) return;

          logger.debug(`found model seed: ${meta.model.getTableName()}`);

          if (await meta.model.findOne()) return;

          if (!meta.seedsHandler) {
            await meta.model.bulkCreate(meta.seeds as never[]);
          } else {
            await meta.seedsHandler(meta.model, meta.seeds);
          }
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
  static async disconnect() {
    await Database.client?.close();
  }
}
