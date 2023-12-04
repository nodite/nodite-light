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
   * 100 - not allow delete
   */
  deleted?: 0 | 1 | 100;

  /**
   * Create by
   * @example Oscaner Miao
   */
  create_by?: string;

  /**
   * Create time
   * @format date-time
   */
  create_time?: Date;

  /**
   * Update by
   * @example Oscaner Miao
   */
  update_by?: string;

  /**
   * Update time
   * @format date-time
   */
  update_time?: Date;
}
