import { DataTypes, Model } from 'sequelize';
import type { InitOptions, ModelAttributeColumnOptions } from 'sequelize/types/model';

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
}

export default BaseModel;
