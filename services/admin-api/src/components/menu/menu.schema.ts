import { DataTypes, ModelAttributeColumnOptions } from 'sequelize';

import BaseModel from '@/components/base.model';

export default {
  menuId: {
    field: 'menu_id',
    type: DataTypes.BIGINT({ length: 20 }),
    allowNull: false,
    unique: true,
    primaryKey: true,
    autoIncrement: true,
  },
  menuName: {
    field: 'menu_name',
    type: DataTypes.STRING(50),
    allowNull: false,
    comment: 'menu title',
  },
  parentId: {
    field: 'parent_id',
    type: DataTypes.BIGINT({ length: 20 }),
    defaultValue: 0,
  },
  orderNum: {
    field: 'order_num',
    type: DataTypes.INTEGER({ length: 4 }),
    defaultValue: 0,
  },
  icon: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  iKey: {
    field: 'i_key',
    type: DataTypes.STRING(100),
    comment: 'i18n key',
  },
  iType: {
    field: 'i_type',
    type: DataTypes.STRING(32),
    defaultValue: '',
    comment: 'menu type: overline, directory, menu, action',
  },
  path: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  redirect: {
    type: DataTypes.STRING(200),
    defaultValue: '',
  },
  component: {
    type: DataTypes.STRING(255),
    defaultValue: '',
  },
  hidden: {
    type: DataTypes.TINYINT({ length: 1 }),
    defaultValue: 0,
    comment: '0: show, 1: hidden',
  },
  layout: {
    type: DataTypes.STRING(32),
    defaultValue: '',
  },
  perms: {
    type: DataTypes.STRING(100),
    defaultValue: '',
  },
  ...BaseModel.BaseSchema,
} as Record<string, ModelAttributeColumnOptions>;
