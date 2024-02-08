import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  Column,
  Comment,
  DataType,
  Default,
  HasOne,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import LocaleModel from '@/components/locale/locale.model';
import LocaleSourceModel from '@/components/locale/locale_source.model';
import LocaleMessageSeeds from '@/seeds/sys_locale_message.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_locale_message',
  indexes: [
    {
      name: 'src_id',
      fields: ['src_id'],
    },
    {
      name: 'langcode',
      fields: ['langcode'],
    },
  ],
})
@Subscribe(LocaleMessageSeeds)
export default class LocaleMessageModel extends SequelizeModel<LocaleMessageModel> {
  @PrimaryKey
  @AllowNull(false)
  @Comment('Source string ID. References "sys_locale_source".srcId.')
  @Column({ field: 'src_id', type: DataType.UUID })
  srcId: string;

  @PrimaryKey
  @AllowNull(false)
  @Comment('Language code. References "sys_locale".langcode.')
  @Column(DataType.STRING(20))
  langcode: string;

  @Default('')
  @AllowNull(false)
  @Comment('Translation string value in this language.')
  @Column({
    field: 'message',
    type: DataType.BLOB,
    get() {
      return this.getDataValue('message')?.toString('utf8');
    },
  })
  message: string;

  @Default(0)
  @AllowNull(false)
  @Comment('Boolean indicating whether the translation is custom to this site.')
  @Column(DataType.TINYINT({ length: 1 }))
  customized: 0 | 1;

  @HasOne(() => LocaleModel, {
    foreignKey: 'langcode',
    constraints: false,
  })
  locale: LocaleModel;

  @HasOne(() => LocaleSourceModel, {
    foreignKey: 'srcId',
    constraints: false,
  })
  source: LocaleSourceModel;
}

export type ILocaleMessage = Pick<
  InstanceType<typeof LocaleMessageModel>,
  | 'srcId'
  | 'langcode'
  | 'message'
  | 'customized'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
