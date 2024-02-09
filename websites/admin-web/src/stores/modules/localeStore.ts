import httpStatus from 'http-status';
import moment from 'moment';

import {
  IAvailableLocale,
  ILocale,
  IMessageUpsert,
  ISourceCreate,
  QueryParams,
  SequelizePaginationISourceWithMessages,
} from '@/api/admin/data-contracts';
import * as LocaleApi from '@/api/admin/Locale';
import i18n from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import { Locale as LocaleConfig } from '@/types/config';
import localeUtil from '@/utils/locale';
import lodash from '@/utils/lodash';
import axios from '@/utils/requests';

interface LocaleState {
  initialized: boolean;
  currLocale: IAvailableLocale;

  availableLocales: IAvailableLocale[];
  availableMessages: { [langcode: string]: LocaleConfig.Message };

  createdSources: { [key: string]: boolean };
  pageTab: 'locales' | 'messsages';
}

export const useLocaleStore = defineStore('locale', {
  state: (): LocaleState => ({
    initialized: false,
    currLocale: {
      langcode: localeUtil.getCurrLang(),
      momentCode: localeUtil.getCurrLang(),
    } as IAvailableLocale,

    availableLocales: [],
    availableMessages: {},

    createdSources: {},
    pageTab: 'locales',
  }),

  persist: [{ storage: localStorage }],

  getters: {},

  actions: {
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
    async listAvailableLocales(force: boolean = false): Promise<IAvailableLocale[]> {
      if (lodash.isEmpty(this.availableLocales) || force) {
        this.availableLocales = (await LocaleApi.adminLocaleAvailable()) || [];
      }
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
      await this.initialize(true);
    },
    /**
     * Edit locale.
     * @param locale
     */
    async editLocale(locale: ILocale): Promise<void> {
      await LocaleApi.adminLocaleEdit(locale.localeId, lodash.omit(locale, ['localeId']));
      await this.initialize(true);
    },
    /**
     * Delete locale.
     * @param id
     */
    async deleteLocale(id: number): Promise<void> {
      await LocaleApi.adminLocaleDelete(id);
      await this.initialize(true);
    },
    /**
     * List source.
     * @param param
     * @returns
     */
    async listSource(
      param?: QueryParams,
    ): Promise<SequelizePaginationISourceWithMessages | undefined> {
      return await LocaleApi.adminLocaleSourceList(param);
    },
    /**
     * Create source
     * @param source
     */
    async createSource(source: ISourceCreate): Promise<void> {
      if (!(await useProfileStore().hasPerm('admin:locale:source:create'))) return;

      const key = localeUtil.toKey(source.source, source.context);

      if (lodash.has(this.createdSources, key)) return;

      const response = await LocaleApi.adminLocaleSourceCreateSkipErrorHandler(source);

      if (response.status === httpStatus.OK) lodash.set(this.createdSources, key, true);
    },
    /**
     * Upsert messages.
     * @param messages
     * @returns
     */
    async upsertMessages(messages: IMessageUpsert[]): Promise<void> {
      await LocaleApi.adminLocaleMessageUpsert(
        lodash.map(messages, (i) => ({ ...i, customized: 1 })),
      );
    },

    /**
     * Initialize.
     */
    async initialize(froce: boolean = false) {
      if (froce) this.initialized = false;
      if (!this.initialized) await this.listAvailableLocales();
      await Promise.all([
        this.setCurrLocale(this.currLocale),
        this.setDefaultLocale({ langcode: (await this.getDefaultLocale()).langcode } as ILocale),
      ]);
      this.initialized = true;
    },
    /**
     * Initialize messages.
     * @returns
     */
    async initializeMessages(langcode: string, force: boolean = false) {
      const messagePath = [langcode, localeUtil.PREFIX];

      if (!lodash.has(this.availableMessages, langcode) || force) {
        lodash.set(
          this.availableMessages,
          messagePath,
          lodash
            .chain((await LocaleApi.adminLocaleMessageAvailable({ langcode: langcode })) || [])
            .map((i) => ({ key: localeUtil.toKey(i.source, i.context, ''), ...i }))
            .groupBy('langcode')
            .mapValues((i) => lodash.chain(i).keyBy('key').mapValues('message').value())
            .get(langcode)
            .value(),
        );
      }

      const effected = lodash.isEqual(
        lodash.get(this.availableMessages, messagePath) || 0,
        lodash.get(i18n.global.messages.value, messagePath) || 1,
      );

      if (!effected && !lodash.isEmpty(this.availableMessages[langcode])) {
        console.log('mergeLocaleMessage', langcode);
        i18n.global.mergeLocaleMessage(langcode, this.availableMessages[langcode]);
      }
    },
    /**
     * Get default locale.
     * @returns
     */
    async getDefaultLocale(): Promise<IAvailableLocale> {
      return (
        lodash.find(await this.listAvailableLocales(), { isDefault: 1 }) ||
        lodash.find(await this.listAvailableLocales(), { langcode: localeUtil.getDefLang() }) ||
        ({
          langcode: localeUtil.getDefLang(),
          momentCode: localeUtil.getDefLang(),
        } as IAvailableLocale)
      );
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
      // html attribute.
      document.querySelector('html')?.setAttribute('def-lang', locale.langcode);
      // messages.
      await this.initializeMessages(locale.langcode);
    },
    /**
     * Set currLocale.
     * @param locale
     */
    async setCurrLocale(locale: IAvailableLocale) {
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
      // messages.
      await this.initializeMessages(locale.langcode);
    },
  },
});
