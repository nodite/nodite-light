import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  BelongsTo,
  Column,
  Comment,
  DataType,
  Default,
  ForeignKey,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import DictGroupModel from '@/components/dict_group/dict_group.model';
import DictTypeSeeds from '@/seeds/sys_dict_type.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_dict_type',
})
@Subscribe(DictTypeSeeds)
export default class DictTypeModel extends SequelizeModel<DictTypeModel> {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'dict_id', type: DataType.BIGINT({ length: 20 }) })
  dictId: number;

  @ForeignKey(() => DictGroupModel)
  @Comment('dict group id')
  @Column({ field: 'dict_gid', type: DataType.BIGINT({ length: 20 }) })
  dictGid: number;

  @AllowNull(false)
  @Comment('dict name')
  @Column({ field: 'dict_name', type: DataType.STRING(50) })
  dictName: string;

  @Comment('i18n key')
  @Column({ field: 'i_key', type: DataType.STRING(100) })
  iKey: string;

  @AllowNull(false)
  @Column({ field: 'dict_type', type: DataType.STRING(32) })
  dictType: 'default' | 'select';

  @Comment('dict desc')
  @Column({ field: 'dict_desc', type: DataType.TEXT })
  dictDesc: string;

  @Default(0)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @BelongsTo(() => DictGroupModel, {
    foreignKey: 'group_id',
    constraints: false,
  })
  dictGroup: DictGroupModel;
}

export type IDictType = Pick<
  InstanceType<typeof DictTypeModel>,
  | 'dictId'
  | 'dictGid'
  | 'dictName'
  | 'iKey'
  | 'dictType'
  | 'dictDesc'
  | 'orderNum'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
