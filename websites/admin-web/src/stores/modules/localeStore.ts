import moment from 'moment';

import { IAvailableLocale, ILocale, ISourceCreate } from '@/api/admin/data-contracts';
import * as LocaleApi from '@/api/admin/Locale';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import localeUtil from '@/utils/locale';
import lodash from '@/utils/lodash';
import axios from '@/utils/requests';

interface LocaleState {
  initialized: boolean;
  entryLocale: IAvailableLocale;
  currLocale: IAvailableLocale;
  availableLocales: IAvailableLocale[];
  createdSources: { [key: string]: boolean };
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    initialized: false,
    entryLocale: {
      langcode: localeUtil.BROWSER_LOCALE,
    } as IAvailableLocale,
    currLocale: {
      langcode: localeUtil.BROWSER_LOCALE,
      momentCode: localeUtil.BROWSER_LOCALE,
    } as IAvailableLocale,
    availableLocales: [],
    createdSources: {},
  }),

  persist: [
    {
      storage: localStorage,
      paths: ['initialized', 'entryLocale', 'currLocale', 'availableLocales', 'createdSources'],
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
      if (!this.initialized) await this.listAvailableLocales();
      this.setCurrLocale(this.currLocale);
      this.setDefaultLocale({ langcode: this.fallbackLocale.langcode } as ILocale);
      this.initialized = true;
    },
    /**
     * List locales.
     * @returns
     */
    async listLocales(): Promise<ILocale[] | undefined> {
      return await LocaleApi.adminLocaleList();
    },
    /**
     * List available locales.
     * @returns
     */
    async listAvailableLocales(): Promise<IAvailableLocale[]> {
      if (!lodash.isEmpty(this.availableLocales.length)) return this.availableLocales;
      this.availableLocales = (await LocaleApi.adminLocaleAvailable()) || [];
      return this.availableLocales;
    },
    /**
     * Query locale.
     * @param id
     * @returns
     */
    async queryLocale(id: number): Promise<ILocale | undefined> {
      return await LocaleApi.adminLocaleQuery(id);
    },
    /**
     * Create locale.
     * @param locale
     */
    async createLocale(locale: ILocale): Promise<void> {
      await LocaleApi.adminLocaleCreate(locale);
      await this.$reset();
    },
    /**
     * Edit locale.
     * @param locale
     */
    async editLocale(locale: ILocale): Promise<void> {
      await LocaleApi.adminLocaleEdit(locale.localeId, lodash.omit(locale, ['localeId']));
      await this.$reset();
    },
    /**
     * Delete locale.
     * @param id
     */
    async deleteLocale(id: number): Promise<void> {
      await LocaleApi.adminLocaleDelete(id);
      await this.$reset();
    },
    /**
     * Create source
     * @param source
     */
    async createSource(source: ISourceCreate): Promise<void> {
      if (!useProfileStore().hasPerm('admin:locale:source:create')) return;

      const key = localeUtil.toKey(source.source, source.context);

      if (lodash.has(this.createdSources, key)) return;

      await LocaleApi.adminLocaleSourceCreateSkipErrorHandler(source);

      lodash.set(this.createdSources, key, true);
    },
    /**
     * Set default locale.
     * @param locale
     */
    async setDefaultLocale(locale: ILocale) {
      // backend.
      if (locale.localeId)
        await this.editLocale({ localeId: locale.localeId, isDefault: 1 } as ILocale);
      // fallback locale.
      if (locale.langcode) i18n.global.fallbackLocale.value = locale.langcode as any;
    },
    /**
     * Set currLocale.
     * @param locale
     */
    setCurrLocale(locale: IAvailableLocale) {
      // pinia store.
      this.currLocale = locale;
      // vue-i18n.
      i18n.global.locale.value = this.currLocale.langcode as any;
      // moment locale.
      if (this.currLocale.momentCode) moment.locale(this.currLocale.momentCode);
      // html attribute.
      document.querySelector('html')?.setAttribute('lang', locale.langcode);
      // axios headers.
      axios.defaults.headers.common['Accept-Language'] = locale.langcode;
    },
  },
});
