import lodash from 'lodash';
import { defineStore } from 'pinia';

import * as AuthApi from '@/api/admin/Auth';
import { IUser } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';
import i18n from '@/plugins/i18n';
import router from '@/router';
import { useSnackbarStore } from '@/stores/modules/snackbarStore';
import * as toolkit from '@/utils/request/toolkit';

import { useAppStore } from './appStore';

export type AuthState = {
  isLoggedIn: boolean;
  user: IUser | undefined;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: undefined,
  }),

  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage },
      // { storage: sessionStorage, paths: ["profile"] }
    ],
  },

  getters: {},

  actions: {
    async getUser() {
      if (lodash.isEmpty(this.user)) {
        console.log('fetch user');
        this.user = await UserApi.curr();
      }
      return this.user;
    },

    async registerWithEmailAndPassword(userInfo: unknown) {
      router.push('/');
    },

    async login(userInfo: Record<string, unknown>) {
      const response = await AuthApi.login({
        username: userInfo.username as string,
        email: userInfo.email as string,
        password: userInfo.password as string,
      });
      toolkit.token.set(response?.token || '', response?.expiresIn);
      this.isLoggedIn = true;
      useSnackbarStore().showSuccessMessage(i18n.global.t('login.success'));
      router.push('/');
    },

    async loginWithWeChat() {
      useSnackbarStore().showWarningMessage('WeChat login is not supported yet.');
    },

    async loginWithGoogle() {
      useSnackbarStore().showWarningMessage('Google login is not supported yet.');
    },

    async logout() {
      await AuthApi.logout();
      toolkit.token.remove();
      this.$reset();
      router.push({ name: 'auth-signin' });
    },
  },
});
