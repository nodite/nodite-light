import { Sequelize } from 'sequelize';

import { BaseModel as Model } from '@/nodite-sequelize/model';

export interface SequelizeStoreOptions {
  host?: string;
  port?: number;
  user?: string;
  pass?: string;
  dbName?: string;
  engine?: string;
  storagePath?: string;
  exitOnFail?: boolean;
}

export interface ModelInitialFunction<T extends typeof Model> {
  (sequelize: Sequelize): T;
}

export interface ModelRegister {
  tableName: string;
  fn: ModelInitialFunction<typeof Model>;
}

export interface ModelSeedFunction<T extends typeof Model> {
  (model: T): Promise<void>;
}
