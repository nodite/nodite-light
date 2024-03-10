import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op } from 'sequelize';

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
    if (!locale) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Locale not found');
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
  public async updateLocale(id: number, locale: ILocaleUpdate): Promise<ILocale> {
    // status.
    if (
      !lodash.isUndefined(locale.status) &&
      !lodash.isNull(locale.status) &&
      !locale.status &&
      (await LocaleModel.count({ where: { status: 1, localeId: { [Op.ne]: id } } })) === 0
    ) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'At least one locale must be enable.');
    }

    // isDefault.
    if (lodash.isUndefined(locale.isDefault) || lodash.isNull(locale.isDefault)) {
      /** empty */
    }
    // If isDefault is true, set all other locales to false.
    else if (locale.isDefault) {
      await LocaleModel.update({ isDefault: 0 }, { where: { isDefault: 1 } });
    }
    // If isDefault is false, check if there is at least one default locale.
    else {
      const count = await LocaleModel.count({ where: { isDefault: 1, localeId: { [Op.ne]: id } } });
      if (count === 0) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'At least one locale must be default.');
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
    const locale = await LocaleModel.findOne({ where: { localeId: id } });
    if (!locale) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Locale not found');
    }
    await locale.destroy();
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
   * @param body
   * @returns
   */
  public async createSourceIfMissing(body: ISourceCreate): Promise<ILocaleSource> {
    let source = await LocaleSourceModel.findOne({
      where: { source: body.source, context: body.context },
    });

    if (lodash.isEmpty(source)) {
      source = await LocaleSourceModel.create(lodash.omit(body, 'locations'));

      await LocaleLocationModel.bulkCreate(
        lodash.map(body.locations, (location) =>
          lodash.set(location, 'srcId', source.getDataValue('srcId')),
        ),
      );

      const defaultLocale = await LocaleModel.findOne({
        attributes: ['langcode'],
        where: { isDefault: 1 },
      });

      await this.upsertMessages([
        {
          srcId: source.getDataValue('srcId'),
          langcode: defaultLocale.getDataValue('langcode'),
          message: body.source,
        },
      ] as IMessageUpsert[]);
    }

    return source.toJSON();
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
