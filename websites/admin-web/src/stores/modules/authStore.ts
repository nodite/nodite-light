import { defineStore } from 'pinia';

import * as AuthApi from '@/api/admin/Auth';
import { LoginBody } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import router from '@/router';
import { useSnackbarStore } from '@/stores/modules/snackbarStore';
import * as toolkit from '@/utils/request/toolkit';

export type AuthState = {
  isLoggedIn: boolean;
  user: LoginBody | undefined;
};

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: undefined,
  }),

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['isLoggedIn'] }],
  },

  getters: {},

  actions: {
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
      const res = await AuthApi.logout();
      console.log('logout', res);
      toolkit.token.remove();
      this.$reset();
      router.push({ name: 'auth-signin' });
    },
  },
});
