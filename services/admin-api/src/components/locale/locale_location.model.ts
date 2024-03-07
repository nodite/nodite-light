import { SequelizeDatabase, SequelizeModel } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  HasOne,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import LocaleSourceModel from '@/components/locale/locale_source.model';
import LocaleLocationSeeds from '@/seeds/sys_locale_location.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_locale_location',
  indexes: [
    {
      name: 'source_type',
      fields: ['src_id', 'type'],
    },
  ],
})
@SequelizeDatabase.subscribe(LocaleLocationSeeds)
export default class LocaleLocationModel extends SequelizeModel<LocaleLocationModel> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Comment('Unique identifier of this location.')
  @Column({ field: 'lc_id', type: DataType.INTEGER })
  lcId: number;

  @AllowNull(false)
  @Comment('Unique identifier of this source.')
  @Column({ field: 'src_id', type: DataType.UUID })
  srcId: string;

  @Default('')
  @AllowNull(false)
  @Comment('The location type (file, component, config, etc).')
  @Column(DataType.STRING(50))
  type: string;

  @Default('')
  @AllowNull(false)
  @Comment('Type dependent location information (file name, path, etc).')
  @Column(DataType.TEXT)
  name: string;

  @HasOne(() => LocaleSourceModel, {
    foreignKey: 'srcId',
    constraints: false,
  })
  source: LocaleSourceModel;
}

export type ILocaleLocation = Pick<
  InstanceType<typeof LocaleLocationModel>,
  | 'lcId'
  | 'srcId'
  | 'type'
  | 'name'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
