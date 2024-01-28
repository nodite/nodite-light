import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  HasMany,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import LocaleMessageModel from '@/components/locale/locale_message.model';
import LocaleSeeds from '@/seeds/sys_locale.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_locale',
})
@Subscribe(LocaleSeeds)
export default class LocaleModel extends SequelizeModel<LocaleModel> {
  @Unique
  @PrimaryKey
  @AutoIncrement
  @AllowNull(false)
  @Comment('Unique identifier of this locale.')
  @Column({ field: 'locale_id', type: DataType.INTEGER })
  localeId: number;

  @Default('')
  @AllowNull(false)
  @Comment('locale label')
  @Column(DataType.STRING(50))
  label: string;

  @Unique
  @AllowNull(false)
  @Comment('language code')
  @Column(DataType.STRING(20))
  langcode: string;

  @Default('en')
  @AllowNull(false)
  @Comment('moment locale code')
  @Column({ field: 'moment_code', type: DataType.STRING(20) })
  momentCode: string;

  @Default('')
  @AllowNull(false)
  @Comment('locale icon, e.g. twemoji:flag-united-states')
  @Column(DataType.STRING(50))
  icon: string;

  @Default(0)
  @AllowNull(false)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @Default(0)
  @AllowNull(false)
  @Comment('0: not default, 1: is default')
  @Column({ field: 'is_default', type: DataType.TINYINT({ length: 1 }) })
  isDefault: 0 | 1;

  @HasMany(() => LocaleMessageModel, {
    foreignKey: 'langcode',
    constraints: false,
  })
  messages: LocaleMessageModel[];
}

export type ILocale = Pick<
  InstanceType<typeof LocaleModel>,
  | 'localeId'
  | 'label'
  | 'langcode'
  | 'momentCode'
  | 'icon'
  | 'orderNum'
  | 'isDefault'
  | 'status'
  | 'deleted'
  | 'createBy'
  | 'createTime'
  | 'updateBy'
  | 'updateTime'
>;
