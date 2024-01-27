import { SequelizeModel, Subscribe } from '@nodite-light/admin-database';
import {
  AllowNull,
  AutoIncrement,
  Column,
  Comment,
  DataType,
  Default,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';

import LocaleSeeds from '@/seeds/sys_locale.seeds.json';

@Table({
  ...SequelizeModel.TableOptions,
  tableName: 'sys_locale',
})
@Subscribe(LocaleSeeds)
export default class LocaleLangModel extends SequelizeModel<LocaleLangModel> {
  @AllowNull(false)
  @Unique
  @PrimaryKey
  @AutoIncrement
  @Column({ field: 'locale_id', type: DataType.BIGINT({ length: 20 }) })
  localeId: number;

  @Comment('locale label')
  @Column(DataType.STRING(50))
  label: string;

  @AllowNull(false)
  @Unique
  @Comment('language code for vue-i18n')
  @Column({ field: 'langcode', type: DataType.STRING(20) })
  langcode: string;

  @Default('en')
  @Comment('language code for moment.js, default is en')
  @Column({ field: 'moment_code', type: DataType.STRING(20) })
  momentCode: string;

  @Comment('locale icon, e.g. twemoji:flag-united-states')
  @Column(DataType.STRING(50))
  icon: string;

  @Default(0)
  @Column({ field: 'order_num', type: DataType.INTEGER({ length: 4 }) })
  orderNum: number;

  @Default(0)
  @Comment('0: not default, 1: is default')
  @Column({ field: 'is_default', type: DataType.TINYINT({ length: 1 }) })
  isDefault: 0 | 1;
}

export type ILocale = Pick<
  InstanceType<typeof LocaleLangModel>,
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
