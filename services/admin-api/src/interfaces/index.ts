import { SequelizePaginateOptons } from '@nodite-light/admin-database';

export interface QueryParams extends SequelizePaginateOptons {
  [key: string]: string | string[] | number | boolean | undefined | null;
}
