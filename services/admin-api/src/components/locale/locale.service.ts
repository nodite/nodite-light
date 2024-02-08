import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';

import {
  IAvailableLocale,
  IAvailableMessage,
  ILocaleCreate,
  ILocaleUpdate,
  IMessageUpsert,
  ISourceCreate,
  ISourceWithMessages,
} from '@/components/locale/locale.interface';
import LocaleModel, { ILocale } from '@/components/locale/locale.model';
import LocaleLocationModel from '@/components/locale/locale_location.model';
import LocaleMessageModel from '@/components/locale/locale_message.model';
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
    // If isDefault is true, set all other locales to false.
    if (locale.isDefault) {
      await LocaleModel.update({ isDefault: 0 }, { where: { isDefault: 1 } });
    }
    // If isDefault is false, check if there is at least one default locale.
    else {
      const count = await LocaleModel.count({ where: { isDefault: 1 } });
      if (count === 0) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'At least one locale must be default');
      }
    }

    await LocaleModel.update(locale, { where: { localeId: id } });

    return LocaleModel.findOne({ where: { localeId: id } });
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
   * Select available messages.
   * @param langcode
   * @returns
   */
  public async selectAvailableMessageList(langcode: string): Promise<IAvailableMessage[]> {
    const messages = await LocaleMessageModel.scope('available').findAll({
      attributes: ['langcode', 'message'],
      where: { langcode },
      include: [{ model: LocaleSourceModel, attributes: ['source', 'context'] }],
    });

    return lodash.map(messages, (i) => ({
      langcode: i.langcode,
      message: i.message,
      source: i.source?.source,
      context: i.source?.context,
    }));
  }

  /**
   * Select source list.
   * @param langcode
   * @param params
   * @returns
   */
  public async selectSourceList(
    langcode: string,
    params?: QueryParams,
  ): Promise<SequelizePagination<ISourceWithMessages>> {
    const page = await LocaleSourceModel.paginate({
      where: LocaleSourceModel.buildQueryWhere(params),
      ...lodash.pick(params, ['itemsPerPage', 'page']),
      include: [
        {
          model: LocaleMessageModel,
          where: { langcode },
          required: false,
        },
      ],
    });
    return {
      ...page,
      items: page.items.map((i) => i.toJSON()),
    };
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

      const defaultLocale = await LocaleModel.findOne({
        attributes: ['langcode'],
        where: { isDefault: 1 },
      });

      await this.upsertMessages([
        {
          srcId: storedSource.getDataValue('srcId'),
          langcode: defaultLocale.getDataValue('langcode'),
          message: source.source,
        },
      ] as IMessageUpsert[]);
    }

    return storedSource.toJSON();
  }

  /**
   * Upsert messages.
   * @param messages
   */
  public async upsertMessages(messages: IMessageUpsert[]): Promise<void> {
    await LocaleMessageModel.bulkCreate(messages, {
      updateOnDuplicate: ['message', 'customized'],
    });
  }
}
