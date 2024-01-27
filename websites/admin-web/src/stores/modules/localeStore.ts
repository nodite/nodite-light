import lodash from 'lodash';
import moment from 'moment';

import { IAvailableLocale, ILocale } from '@/api/admin/data-contracts';
import * as LocaleApi from '@/api/admin/Locale';
import localeUtil from '@/utils/locales';

import i18n from '../../plugins/i18n';

interface LocaleState {
  initialized: boolean;
  entryLocale: IAvailableLocale;
  currLocale: IAvailableLocale;
  availableLocales: IAvailableLocale[];
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    initialized: false,
    entryLocale: {
      langcode: localeUtil.DEFAULT_LOCALE,
    } as IAvailableLocale,
    currLocale: {
      langcode: localeUtil.DEFAULT_LOCALE,
      momentCode: localeUtil.DEFAULT_LOCALE,
    } as IAvailableLocale,
    availableLocales: [],
  }),

  persist: [
    {
      storage: localStorage,
      paths: ['initialized', 'entryLocale', 'currLocale', 'availableLocales'],
    },
  ],

  getters: {
    fallbackLocale: (state): IAvailableLocale => {
      return lodash.find(state.availableLocales, { isDefault: 1 }) || state.entryLocale;
    },
  },

  actions: {
    /**
     * initialize.
     */
    async initialize() {
      if (!this.initialized) await this.listAvailable();
      i18n.global.locale.value = this.currLocale.langcode as any;
      i18n.global.fallbackLocale.value = this.fallbackLocale.langcode as any;
      this.initialized = true;
    },
    /**
     * List.
     * @returns
     */
    async list(): Promise<ILocale[] | undefined> {
      return await LocaleApi.adminLocaleList();
    },
    /**
     * List available.
     * @returns
     */
    async listAvailable(): Promise<IAvailableLocale[]> {
      if (!lodash.isEmpty(this.availableLocales.length)) return this.availableLocales;
      this.availableLocales = (await LocaleApi.adminLocaleAvailable()) || [];
      return this.availableLocales;
    },
    /**
     * Query.
     * @param id
     * @returns
     */
    async query(id: number): Promise<ILocale | undefined> {
      return await LocaleApi.adminLocaleQuery(id);
    },
    /**
     * Create.
     * @param locale
     */
    async create(locale: ILocale): Promise<void> {
      await LocaleApi.adminLocaleCreate(locale);
      await this.$reset();
    },
    /**
     * Edit.
     * @param locale
     */
    async edit(locale: ILocale): Promise<void> {
      await LocaleApi.adminLocaleEdit(locale.localeId, lodash.omit(locale, ['localeId']));
      await this.$reset();
    },
    /**
     * Delete.
     * @param id
     */
    async delete(id: number): Promise<void> {
      await LocaleApi.adminLocaleDelete(id);
      await this.$reset();
    },
    /**
     * Set default locale.
     * @param locale
     */
    async setDefaultLocale(locale: ILocale) {
      await this.edit({ localeId: locale.localeId, isDefault: 1 } as ILocale);
      i18n.global.fallbackLocale.value = locale.langcode as any;
    },
    /**
     * Set currLocale.
     * @param locale
     */
    setCurrLocale(locale: IAvailableLocale) {
      this.currLocale = locale;
      i18n.global.locale.value = this.currLocale.langcode as any;
      if (this.currLocale.momentCode) moment.locale(this.currLocale.momentCode);
    },
  },
});
