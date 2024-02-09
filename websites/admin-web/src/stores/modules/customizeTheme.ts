import { isMobile } from 'is-mobile';
import { defineStore } from 'pinia';

import { ThemeConfig } from '@/types/config';

interface State {
  darkTheme: boolean;
  mainSidebar: boolean;
  mainSidebarRail: boolean;
}

export const useCustomizeThemeStore = defineStore({
  id: 'customizeTheme',
  state: (): State => ({
    darkTheme: false,
    mainSidebar: true,
    mainSidebarRail: isMobile() ? true : false,
  }),

  persist: [
    {
      storage: localStorage,
      paths: ['darkTheme', 'mainSidebar', 'mainSidebarRail'],
    },
  ],

  getters: {
    primaryColor: (state): ThemeConfig.Color => {
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
  },
});
