import { AppError } from '@nodite-light/admin-core';
import httpStatus from 'http-status';
import lodash from 'lodash';

import {
  IAvailableLocale,
  ILocaleCreate,
  ILocaleUpdate,
} from '@/components/locale/locale.interface';
import LocaleModel, { ILocale } from '@/components/locale/locale.model';

/**
 * Class LocaleLangService.
 */
export default class LocaleLangService {
  /**
   * Select language list.
   * @returns
   */
  public async selectLocaleList(): Promise<ILocale[]> {
    const langList = await LocaleModel.findAll({
      order: [
        ['orderNum', 'ASC'],
        ['localeId', 'ASC'],
      ],
    });

    return langList.map((i) => i.toJSON());
  }

  /**
   * Select available locales.
   * @returns
   */
  public async selectAvailableLocaleList(): Promise<IAvailableLocale[]> {
    const langList = await LocaleModel.scope('available').findAll({
      attributes: ['langcode', 'momentCode', 'icon', 'label', 'isDefault'],
      order: [
        ['orderNum', 'ASC'],
        ['localeId', 'ASC'],
      ],
    });

    return langList.map((i) => i.toJSON());
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
   * @param lang
   * @returns
   */
  public async create(lang: ILocaleCreate): Promise<ILocale> {
    return LocaleModel.create(lang);
  }

  /**
   * Update.
   * @param id
   * @param locale
   * @returns
   */
  public async update(id: number, locale: ILocaleUpdate): Promise<ILocale> {
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
  public async delete(id: number): Promise<void> {
    const storedLocale = await LocaleModel.findOne({ where: { localeId: id } });
    await storedLocale.destroy();
  }
}
