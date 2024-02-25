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

import LocaleLocationModel from '@/components/locale/locale_location.model';
import LocaleMessageModel from '@/components/locale/locale_message.model';
import LocaleSourceSeeds from '@/seeds/sys_locale_source.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_locale_source',
  indexes: [
    {
      name: 'source_context',
      fields: [{ name: 'source', length: 255 }, 'context'],
      unique: true,
    },
  ],
})
@Subscribe(LocaleSourceSeeds)
export default class LocaleSourceModel extends SequelizeModel<LocaleSourceModel> {
  @Unique
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Comment('Unique identifier of this source.')
  @Column({ field: 'src_id', type: DataType.UUID })
  srcId: string;

  @Default('')
  @AllowNull(false)
  @Comment('The original string.')
  @Column({
    field: 'source',
    type: DataType.BLOB,
    get() {
      return this.getDataValue('source')?.toString('utf8');
    },
  })
  source: string;

  @Default('')
  @AllowNull(false)
  @Comment('The context this string applies to.')
  @Column(DataType.STRING(255))
  context: string;

  @HasMany(() => LocaleMessageModel, {
    foreignKey: 'srcId',
    constraints: false,
  })
  messages: LocaleMessageModel[];

  @HasMany(() => LocaleLocationModel, {
    foreignKey: 'srcId',
    constraints: false,
  })
  locations: LocaleLocationModel[];
}

export type ILocaleSource = Pick<
  InstanceType<typeof LocaleSourceModel>,
  | 'srcId'
  | 'source'
  | 'context'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
