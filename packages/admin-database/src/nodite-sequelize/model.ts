import logger from '@nodite-light/admin-core/lib/utils/logger';
import lodash from 'lodash';
import { DataTypes, Model } from 'sequelize';
import type { InitOptions, ModelAttributeColumnOptions, ModelStatic } from 'sequelize/types/model';

import { FindOptions, Pagination } from '@/nodite-sequelize/interface';

export abstract class BaseModel extends Model {
  /**
   * BaseInitOptions.
   */
  static BaseInitOptions = {
    omitNull: true,
    underscored: true,
    // create time.
    createdAt: 'createTime',
    // update time.
    updatedAt: 'updateTime',
    // auto set create time and update time.
    timestamps: true,
  } as InitOptions;

  /**
   * BaseSchema.
   */
  static BaseSchema = {
    status: {
      type: DataTypes.TINYINT({ length: 1 }),
      defaultValue: 1,
      comment: '0: disabled, 1: enabled',
    },
    deleted: {
      type: DataTypes.TINYINT({ length: 1 }),
      defaultValue: 0,
      comment: '0: normal, 1: soft deleted, 9: not allow delete',
    },
    createBy: {
      field: 'create_by',
      type: DataTypes.STRING(32),
    },
    createTime: {
      field: 'create_time',
      type: DataTypes.DATE,
    },
    updateBy: {
      field: 'update_by',
      type: DataTypes.STRING(32),
    },
    updateTime: {
      field: 'update_time',
      type: DataTypes.DATE,
    },
  } as Record<string, ModelAttributeColumnOptions>;

  /**
   * Table exists.
   * @returns
   */
  public static async exists(): Promise<boolean> {
    return Boolean(await this.sequelize?.getQueryInterface().tableExists(this.tableName));
  }

  /**
   * Soft delete.
   * @returns
   */
  public isSoftDeleted(): boolean {
    return this.getDataValue('deleted') === 1;
  }

  /**
   * Pagination.
   * @param this
   * @param options
   * @returns
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async paginate<M extends Model<any, any>>(
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
}

export default BaseModel;
