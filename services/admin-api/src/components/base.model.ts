import { DataTypes } from 'sequelize';
import { ModelAttributeColumnOptions } from 'sequelize/types/model';

export const BaseSchema = {
  status: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  deleted: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
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

export default BaseSchema;
