import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  ForeignKey,
  HasOne,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import DictGroupModel from '@/components/dict/dict_group.model';
import DictTypeSeeds from '@/seeds/sys_dict_type.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_dict_type',
})
@Subscribe(DictTypeSeeds)
export default class DictTypeModel extends SequelizeModel<DictTypeModel> {
  @Unique
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ field: 'dict_id', type: DataType.UUID })
  dictId: string;

  @ForeignKey(() => DictGroupModel)
  @AllowNull(false)
  @Comment('dict group id')
  @Column({ field: 'dict_gid', type: DataType.UUID })
  dictGid: string;

  @Default('')
  @AllowNull(false)
  @Comment('dict name')
  @Column({ field: 'dict_name', type: DataType.STRING(50) })
  dictName: string;

  @Default('default')
  @AllowNull(false)
  @Column({ field: 'dict_style', type: DataType.STRING(32) })
  dictStyle: string;

  @Unique
  @Default('')
  @AllowNull(false)
  @Column({ field: 'dict_key', type: DataType.STRING(50) })
  dictKey: string;

  @Default('')
  @AllowNull(false)
  @Comment('dict desc')
  @Column({ field: 'dict_desc', type: DataType.TEXT })
  dictDesc: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @HasOne(() => DictGroupModel, {
    foreignKey: 'groupId',
    constraints: false,
  })
  dictGroup: DictGroupModel;
}

export type IDictType = Pick<
  InstanceType<typeof DictTypeModel>,
  | 'dictId'
  | 'dictGid'
  | 'dictName'
  | 'dictStyle'
  | 'dictKey'
  | 'dictDesc'
  | 'orderNum'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
