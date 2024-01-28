import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';

import {
  IAvailableLocale,
  IAvailableMessage,
  ILocaleCreate,
  ILocaleUpdate,
  ISourceCreate,
} from '@/components/locale/locale.interface';
import LocaleModel, { ILocale } from '@/components/locale/locale.model';
import LocaleLocationModel from '@/components/locale/locale_location.model';
import LocaleMessageModel, { ILocaleMessage } from '@/components/locale/locale_message.model';
import { QueryParams } from '@/interfaces';
import lodash from '@/utils/lodash';

import LocaleSourceModel, { ILocaleSource } from './locale_source.model';

/**
 * Class LocaleService.
 */
export default class LocaleService {
  /**
   * Select locales.
   * @returns
   */
  public async selectLocaleList(): Promise<ILocale[]> {
    const locales = await LocaleModel.findAll({
      order: [
        ['orderNum', 'ASC'],
        ['localeId', 'ASC'],
      ],
    });

    return locales.map((i) => i.toJSON());
  }

  /**
   * Select available locales.
   * @returns
   */
  public async selectAvailableLocaleList(): Promise<IAvailableLocale[]> {
    const locales = await LocaleModel.scope('available').findAll({
      attributes: ['langcode', 'momentCode', 'icon', 'label', 'isDefault'],
      order: [
        ['orderNum', 'ASC'],
        ['localeId', 'ASC'],
      ],
    });

    return locales.map((i) => i.toJSON());
  }

  /**
   * Select locale by id.
   * @param id
   * @returns
   */
  public async selectLocaleById(id: number): Promise<ILocale> {
    const locale = await LocaleModel.findOne({ where: { localeId: id } });

    if (lodash.isEmpty(locale)) {
      throw new AppError(httpStatus.NOT_FOUND, 'Locale not found');
    }

    return locale.toJSON();
  }

  /**
   * Create.
   * @param locale
   * @returns
   */
  public async createLocale(locale: ILocaleCreate): Promise<ILocale> {
    return LocaleModel.create(locale);
  }

  /**
   * Update.
   * @param id
   * @param locale
   * @returns
   */
  public async updateLocale(id: number, locale: Partial<ILocaleUpdate>): Promise<ILocale> {
    // start transaction.
    const transaction = await LocaleModel.sequelize.transaction();

    // If isDefault is true, set all other locales to false.
    if (locale.isDefault) {
      await LocaleModel.update({ isDefault: 0 }, { where: { isDefault: 1 }, transaction });
    }
    // If isDefault is false, check if there is at least one default locale.
    else {
      const count = await LocaleModel.count({ where: { isDefault: 1 }, transaction });
      if (count === 0) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'At least one locale must be default');
      }
    }

    const storedLocale = await LocaleModel.findOne({ where: { localeId: id }, transaction });
    const updatedLocale = await storedLocale.update(locale, { transaction });

    // commit transaction.
    await transaction.commit();

    return updatedLocale.toJSON();
  }

  /**
   * Delete.
   * @param id
   */
  public async deleteLocale(id: number): Promise<void> {
    const storedLocale = await LocaleModel.findOne({ where: { localeId: id } });
    await storedLocale.destroy();
  }

  /**
   * Select locale messages.
   * @returns
   */
  public async selectMessageList(
    params?: QueryParams,
  ): Promise<SequelizePagination<ILocaleMessage>> {
    const page = await LocaleMessageModel.paginate({
      where: {
        ...LocaleMessageModel.buildQueryWhere(params),
      },
      ...lodash.pick(params, ['itemsPerPage', 'page']),
    });

    return {
      ...page,
      items: page.items.map((i) => i.toJSON()),
    };
  }

  /**
   * Select available messages.
   * @param langcode
   * @returns
   */
  public async selectAvailableMessageList(langcode: string): Promise<IAvailableMessage> {
    const messages = await LocaleMessageModel.scope('available').findAll({
      where: { langcode },
      include: [{ model: LocaleSourceModel }],
    });

    return lodash
      .chain(messages)
      .map((i) => {
        const message = i.toJSON();
        lodash.set(
          message,
          'key',
          message.source.context
            ? `${message.source.context}.${message.source.source}`
            : message.source.source,
        );
        return message;
      })
      .keyBy('key')
      .mapValues('message')
      .value();
  }

  /**
   * Create source if missing.
   * @param source
   * @returns
   */
  public async createSourceIfMissing(source: ISourceCreate): Promise<ILocaleSource> {
    let storedSource = await LocaleSourceModel.findOne({
      where: { source: source.source, context: source.context },
    });

    if (lodash.isEmpty(storedSource)) {
      storedSource = await LocaleSourceModel.create(lodash.omit(source, 'locations'));

      await LocaleLocationModel.bulkCreate(
        lodash.map(source.locations, (location) =>
          lodash.set(location, 'srcId', storedSource.getDataValue('srcId')),
        ),
      );
    }

    return storedSource.toJSON();
  }
}
