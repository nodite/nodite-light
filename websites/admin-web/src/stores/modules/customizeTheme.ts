import lodash from 'lodash';
import moment from 'moment';
import { defineStore } from 'pinia';

import { LocaleConfig, ThemeConfig } from '@/types/config';

interface State {
  miniSidebar: boolean;
  darkTheme: boolean;
  locale: Omit<LocaleConfig.Locale, 'messages'>;
  mainSidebar: boolean;
}

export const useCustomizeThemeStore = defineStore({
  id: 'customizeTheme',
  state: (): State => ({
    miniSidebar: false,
    darkTheme: false,
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
      paths: ['darkTheme', 'locale', 'mainSidebar'],
    },
  ],

  getters: {
    primaryColor: (state): ThemeConfig.Color => {
      // const primaryColors = ref([
      //   {
      //     colorId: 1,
      //     colorName: 'purple',
      //     colorValue: '#CB0C9F',
      //   },
      //   {
      //     colorId: 2,
      //     colorName: 'grey',
      //     colorValue: '#344767',
      //   },
      //   {
      //     colorId: 3,
      //     colorName: 'info',
      //     colorValue: '#17C1E8',
      //   },
      //   {
      //     colorId: 4,
      //     colorName: 'success',
      //     colorValue: '#82D616',
      //   },
      //   {
      //     colorId: 5,
      //     colorName: 'warning',
      //     colorValue: '#F2825A',
      //   },
      //   {
      //     colorId: 6,
      //     colorName: 'error',
      //     colorValue: '#EA0606',
      //   },
      // ]);
      return state.darkTheme
        ? {
            colorId: 3,
            colorName: 'info',
            colorValue: '#17C1E8',
          }
        : {
            colorId: 2,
            colorName: 'grey',
            colorValue: '#344767',
          };
    },
  },

  actions: {
    setDarkTheme(payload: boolean, updatePrimaryColor: ThemeConfig.UpdatePrimaryColor) {
      this.darkTheme = payload;
      updatePrimaryColor(this.primaryColor);
    },
    setMiniSideBar(payload: boolean) {
      this.miniSidebar = payload;
    },
    setLocale(locale: Omit<LocaleConfig.Locale, 'messages'>) {
      this.locale = lodash.omit(locale, 'messages');
      if (this.locale.momentCode) moment.locale(this.locale.momentCode);
    },
  },
});
