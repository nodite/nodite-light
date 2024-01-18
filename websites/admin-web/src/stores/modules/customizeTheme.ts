import lodash from 'lodash';
import moment from 'moment';
import { defineStore } from 'pinia';

import { LocaleConfig } from '@/types/config';

interface Color {
  colorId: number;
  colorName: string;
  colorValue: string;
}

interface State {
  miniSidebar: boolean;
  darkTheme: boolean;
  primaryColor: Color;
  locale: Omit<LocaleConfig.Locale, 'messages'>;
  mainSidebar: boolean;
}

export const useCustomizeThemeStore = defineStore({
  id: 'customizeTheme',
  state: (): State => ({
    miniSidebar: false,
    darkTheme: false,
    primaryColor: {
      colorId: 3,
      colorName: 'info',
      colorValue: '#17C1E8',
    },
    locale: {
      code: 'en',
      momentCode: 'en',
    } as Omit<LocaleConfig.Locale, 'messages'>,
    mainSidebar: true,
    // mainSidebar: isMobile() ? false : true,
  }),

  persist: [
    {
      storage: localStorage,
      paths: ['darkTheme', 'primaryColor', 'locale', 'mainSidebar'],
    },
  ],

  getters: {},

  actions: {
    setDarkTheme(payload: boolean) {
      this.darkTheme = payload;
    },
    setMiniSideBar(payload: boolean) {
      this.miniSidebar = payload;
    },
    setPrimaryColor(payload: Color) {
      this.primaryColor = payload;
    },
    setLocale(locale: Omit<LocaleConfig.Locale, 'messages'>) {
      this.locale = lodash.omit(locale, 'messages');
      if (this.locale.momentCode) moment.locale(this.locale.momentCode);
    },
  },
});
