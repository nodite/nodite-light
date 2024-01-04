import { SequelizePaginateOptons } from '@nodite-light/admin-database';

export interface IBase {
  /**
   * Status
   * @example 0 - normal, 1 - disabled
   */
  status?: 0 | 1;

  /**
   * Deleted
   * @example
   * 0 - normal,
   * 1 - deleted,
   * 9 - not allow delete
   */
  deleted?: 0 | 1 | 9;

  /**
   * Create by
   * @example Oscaner Miao
   */
  createBy?: string;

  /**
   * Create time
   * @format date-time
   */
  createTime?: Date;

  /**
   * Update by
   * @example Oscaner Miao
   */
  updateBy?: string;

  /**
   * Update time
   * @format date-time
   */
  updateTime?: Date;
}

// export type QueryParams = PaginateOptons;

export interface QueryParams extends SequelizePaginateOptons {
  [key: string]: string | string[] | number | boolean | undefined | null;
}
