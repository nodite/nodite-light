import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import DictTypeModel from '@/components/dict/dict_type.model';
import DictItemSeeds from '@/seeds/sys_dict_item.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_dict_item',
  indexes: [
    {
      name: 'dict_item_key',
      fields: ['dict_key', { name: 'item_key', length: 255 }],
      unique: true,
    },
  ],
})
@SequelizeDatabase.subscribe(DictItemSeeds)
export default class DictItemModel extends SequelizeModel<DictItemModel> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Column({ field: 'item_id', type: DataType.INTEGER })
  itemId: number;

  @Default('')
  @AllowNull(false)
  @Column({ field: 'dict_key', type: DataType.STRING(50) })
  dictKey: string;

  @AllowNull(false)
  @Column({
    field: 'item_key',
    type: DataType.BLOB({ length: 'tiny' }),
    get() {
      return this.getDataValue('itemKey')?.toString('utf8');
    },
  })
  itemKey: string;

  @Default('')
  @AllowNull(false)
  @Column({ field: 'item_value', type: DataType.STRING(100) })
  itemValue: string;

  @Default('')
  @AllowNull(false)
  @Column({ field: 'item_desc', type: DataType.TEXT })
  itemDesc: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @BelongsTo(() => DictTypeModel, {
    foreignKey: 'dictKey',
    targetKey: 'dictKey',
    constraints: false,
  })
  dictType: DictTypeModel;
}

export type IDictItem = Pick<
  InstanceType<typeof DictItemModel>,
  | 'itemId'
  | 'dictKey'
  | 'itemKey'
  | 'itemValue'
  | 'itemDesc'
  | 'orderNum'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
