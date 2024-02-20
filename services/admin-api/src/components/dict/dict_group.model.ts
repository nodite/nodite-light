import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  HasMany,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import DictTypeModel from '@/components/dict/dict_type.model';
import DictGroupSeeds from '@/seeds/sys_dict_group.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_dict_group',
})
@Subscribe(DictGroupSeeds)
export default class DictGroupModel extends SequelizeModel<DictGroupModel> {
  @Unique
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column({ field: 'group_id', type: DataType.UUID })
  groupId: string;

  @Default('')
  @AllowNull(false)
  @Comment('dict group name')
  @Column({ field: 'group_name', type: DataType.STRING(50) })
  groupName: string;

  @Unique
  @Default('')
  @Column({ field: 'group_key', type: DataType.STRING(50) })
  groupKey: string;

  @Default('')
  @AllowNull(false)
  @Column({ field: 'parent_id', type: DataType.UUID })
  parentId: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @HasMany(() => DictTypeModel, {
    foreignKey: 'dict_gid',
    constraints: false,
  })
  dictTypes: DictTypeModel[];
}

export type IDictGroup = Pick<
  InstanceType<typeof DictGroupModel>,
  | 'groupId'
  | 'groupName'
  | 'groupKey'
  | 'parentId'
  | 'orderNum'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
