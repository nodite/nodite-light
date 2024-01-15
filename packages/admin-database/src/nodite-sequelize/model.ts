import { logger } from '@nodite-light/admin-core';
import httpContext from 'express-http-context';
import lodash from 'lodash';
import { InitOptions, ModelStatic, Op, ValidationError } from 'sequelize';
import {
  BeforeBulkCreate,
  BeforeBulkDestroy,
  BeforeBulkUpdate,
  BeforeCreate,
  BeforeDestroy,
  BeforeUpdate,
  Column,
  Comment,
  CreatedAt,
  DataType,
  Default,
  Model,
  UpdatedAt,
} from 'sequelize-typescript';

import { FindOptions, Pagination } from '@/nodite-sequelize/interface';
/**
 * Class BaseModel.
 */
export default abstract class BaseModel<T extends Model<T>> extends Model<T> {
  /**
   * TableInitOptions.
   */
  static readonly TableOptions = {
    omitNull: true,
    underscored: true,
    timestamps: true,
  } as InitOptions;

  @Default(1)
  @Comment('0: disabled, 1: enabled')
  @Column(DataType.TINYINT({ length: 1 }))
  status: 0 | 1;

  @Default(0)
  @Comment('0: normal, 1: soft deleted, 9: not allow delete')
  @Default(0)
  @Column(DataType.TINYINT({ length: 1 }))
  deleted: 0 | 1 | 9;

  @Column({ field: 'create_by', type: DataType.STRING(32) })
  createBy: string;

  @CreatedAt
  @Column({ field: 'create_time', type: DataType.DATE })
  createTime: Date;

  @Column({ field: 'update_by', type: DataType.STRING(32) })
  updateBy: string;

  @UpdatedAt
  @Column({ field: 'update_time', type: DataType.DATE })
  updateTime: Date;

  /**
   * Not allow delete.
   * @param instance
   */
  @BeforeDestroy
  static notAllowDeleteNine(instance: BaseModel<never>): void {
    if (instance.previous('deleted') === 9) {
      throw new ValidationError('Not allow delete!', []);
    }
  }

  /**
   * Deleted not equal 9.
   * @param options
   */
  @BeforeBulkDestroy
  static deletedNotEqualNine(options: FindOptions): void {
    const deleted = lodash.get(options, 'where.deleted', {});
    lodash.set(options, 'where.deleted', { ...deleted, [Op.ne]: 9 });
  }

  /**
   * Set create by.
   * @param instance
   */
  @BeforeCreate
  static setCreateBy(instance: BaseModel<never>): void {
    instance.setDataValue(
      'createBy',
      instance.getDataValue('createBy') ||
        (lodash.get(httpContext.get('user'), 'username', 'unknown') as never),
    );
  }

  /**
   * Bulk set create by.
   * @param instances
   */
  @BeforeBulkCreate
  static bulkSetCreateBy(instances: BaseModel<never>[]): void {
    instances.forEach((instance) => this.setCreateBy(instance));
  }

  /**
   * Set update by.
   * @param instance
   */
  @BeforeUpdate
  static setUpdateBy(instance: BaseModel<never>): void {
    instance.setDataValue('updateBy', this.getUpdateBy() as never);
  }

  /**
   * Bulk set update by.
   * @param options
   * @returns
   */
  @BeforeBulkUpdate
  static bulkSetUpdateBy(options: FindOptions): void {
    const { attributes } = options;
    if (!attributes) return;
    lodash.set(options, 'attributes.updateBy', this.getUpdateBy());
  }

  /**
   * Table exists.
   * @returns
   */
  public static async exists(): Promise<boolean> {
    return Boolean(await this.sequelize?.getQueryInterface().tableExists(this.tableName));
  }

  /**
   * Pagination.
   * @param this
   * @param options
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async paginate<M extends Model>(
    this: ModelStatic<M>,
    options?: FindOptions,
  ): Promise<Pagination<M>> {
    // total count.
    const countOptions = Object.keys(options).reduce((acc, key) => {
      if (['order', 'attributes', 'include', 'page', 'itemsPerPage'].includes(key)) return acc;
      return { ...acc, [key]: lodash.get(options, key) };
    }, {});

    const totalCount = await this.count(countOptions);

    // pages.
    if (options.limit) {
      logger.warn('options.limit is not allowed, please use options.itemsPerPage instead!');
    }
    if (options.offset) {
      logger.warn('options.offset is not allowed, please use options.page instead!');
    }

    const itemsPerPage = lodash.get(options, 'itemsPerPage', 25);
    const totalPage = itemsPerPage > 0 ? Math.ceil(totalCount / itemsPerPage) : 1;

    if (itemsPerPage > 0) {
      lodash.set(options, 'limit', Number(itemsPerPage));
      lodash.set(options, 'offset', (lodash.get(options, 'page', 1) - 1) * itemsPerPage);
    } else {
      // eslint-disable-next-line no-param-reassign
      options = lodash.omit(options, ['limit', 'offset']);
    }

    const items = await this.findAll(options);

    return {
      items,
      count: items.length,
      totalCount,
      totalPage,
      page: Number(options.page),
      itemsPerPage: Number(itemsPerPage),
    };
  }

  /**
   * Get default update by.
   * @returns
   */
  private static getUpdateBy(): string {
    return lodash.get(httpContext.get('user'), 'username', 'unknown');
  }
}
