import { FindOptions as CoreFindOptions, Sequelize } from 'sequelize';

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

export interface PaginateOptons {
  page?: number;
  itemsPerPage?: number;
}

export type FindOptions = CoreFindOptions & PaginateOptons;

export interface Pagination<M> {
  items: M[];
  count: number;
  totalCount: number;
  totalPage: number;
  page: number;
  itemsPerPage: number;
}
