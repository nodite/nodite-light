import { DataTypes, ModelAttributeColumnOptions } from 'sequelize';

import BaseModel from '@/components/base.model';

export default {
  roleId: {
    field: 'role_id',
    type: DataTypes.BIGINT({ length: 20 }),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  roleName: {
    field: 'role_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'role name',
  },
  roleKey: {
    field: 'role_key',
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    comment: 'role key',
  },
  orderNum: {
    field: 'order_num',
    type: DataTypes.INTEGER({ length: 4 }),
    defaultValue: 0,
  },
  iKey: {
    field: 'i_key',
    type: DataTypes.STRING(100),
    comment: 'i18n key',
  },
  ...BaseModel.BaseSchema,
} as Record<string, ModelAttributeColumnOptions>;
