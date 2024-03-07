import { FindOptions as CoreFindOptions } from 'sequelize';

import Model from '@/nodite-sequelize/model';

export interface SequelizeStoreOptions {
  host: string;
  port: number;
  user: string;
  pass: string;
  dbName: string;
  engine?: string;
  storagePath?: string;
  exitOnFail?: boolean;
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
