import { Model, Sequelize } from 'sequelize';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ModelInitialFunction<T extends typeof Model = any> {
  (sequelize: Sequelize): T;
}

export interface ModelRegister {
  tableName: string;
  fn: ModelInitialFunction;
}
