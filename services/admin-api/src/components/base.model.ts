import { AuthorizedRequest } from '@nodite-light/admin-auth/lib/interfaces/authorizedRequest';
import httpContext from 'express-http-context';
import lodash from 'lodash';
import { DataTypes, Model } from 'sequelize';
import type {
  BuildOptions,
  CreationAttributes,
  InitOptions,
  ModelAttributeColumnOptions,
  ModelStatic,
} from 'sequelize/types/model';

export class BaseModel extends Model {
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
      comment: '0: normal, 1: deleted, 9: not allow delete',
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
   * Override build method.
   */
  public static build<M extends Model>(
    this: ModelStatic<M>,
    record?: CreationAttributes<M>,
    options?: BuildOptions,
  ): M {
    const user = httpContext.get('user') as AuthorizedRequest['user'];

    const newRecord = { ...record };

    // create by.
    if (options?.isNewRecord === true) {
      lodash.set(
        newRecord,
        'createBy',
        lodash.get(newRecord, 'createBy', user?.username || 'unknown'),
      );
    }

    // update by.
    lodash.set(
      newRecord,
      'updateBy',
      lodash.get(newRecord, 'updateBy', user?.username || 'unknown'),
    );

    return super.build<M>(record, options);
  }
}

export default {};
