import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';

import * as AuthApi from '@/api/admin/Auth';
import { LoginBody } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import cache from '@/utils/cache';
import * as rToolkit from '@/utils/requestToolkit';

export interface AuthState {
  isLoggedIn: boolean;
  user: LoginBody | undefined;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isLoggedIn: false,
    user: undefined,
  }),

  persist: [{ storage: localStorage, paths: ['isLoggedIn', 'user.username', 'user.email'] }],

  getters: {
    /**
     * Is authorized?
     * @param state
     * @returns
     */
    isAuthorized: (state) => {
      return rToolkit.token.get() && state.isLoggedIn;
    },
  },

  actions: {
    async register(userInfo: Record<string, unknown>) {
      toast.warning(i18n.ndt('System Maintenance'));
    },

    /**
     * Login.
     * @param userInfo
     */
    async login(userInfo: LoginBody) {
      const response = await AuthApi.adminAuthLogin(userInfo);
      rToolkit.token.set(response?.token || '', response?.expiresIn);
      this.isLoggedIn = true;
      toast.success(i18n.ndt('Login successfully'));
      window.location.href = `${import.meta.env.VITE_APP_BASE_PATH || ''}/`;
    },

    /**
     * Login with WeChat.
     */
    async loginWithWeChat() {
      toast.warning(i18n.ndt('WeChat login is not supported yet.'));
    },

    /**
     * Login with Google.
     */
    async loginWithGoogle() {
      toast.warning(i18n.ndt('Google login is not supported yet.'));
    },

    /**
     * Logout.
     * @param redirect
     */
    async logout(redirect: boolean = false) {
      await AuthApi.adminAuthLogout();
      // remove token.
      rToolkit.token.remove();
      // remove logged in status.
      this.$patch({ isLoggedIn: false });
      // clear cache.
      cache.invalidateStore.all();
      // redirect to login page if needed.
      if (redirect) rToolkit.redirectToLogin();
    },
  },
});
