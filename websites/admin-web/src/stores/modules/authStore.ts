/*
 * File: authStore.ts                                                          *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: We Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Thu Dec 21 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import { defineStore } from 'pinia';
import { toast } from 'vuetify-sonner';

import * as AuthApi from '@/api/admin/Auth';
import { LoginBody } from '@/api/admin/data-contracts';
import { $ndt } from '@/plugins/i18n';
import { useProfileStore } from '@/stores/modules/profileStore';
import * as toolkit from '@/utils/request/toolkit';

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
      return toolkit.token.get() && state.isLoggedIn;
    },
  },

  actions: {
    async register(userInfo: Record<string, unknown>) {
      toast.warning($ndt('common.maintenance'));
    },

    /**
     * Login.
     * @param userInfo
     */
    async login(userInfo: LoginBody) {
      await useProfileStore().clearCache();
      const response = await AuthApi.adminAuthLogin(userInfo);
      toolkit.token.set(response?.token || '', response?.expiresIn);
      this.isLoggedIn = true;
      toast.success($ndt('login.success'));
      window.location.href = `${import.meta.env.VITE_APP_BASE_PATH || ''}/`;
    },

    /**
     * Login with WeChat.
     */
    async loginWithWeChat() {
      toast.warning('WeChat login is not supported yet.');
    },

    /**
     * Login with Google.
     */
    async loginWithGoogle() {
      toast.warning('Google login is not supported yet.');
    },

    /**
     * Logout.
     * @param redirect
     */
    async logout(redirect: boolean = false) {
      await AuthApi.adminAuthLogout();
      // remove token.
      toolkit.token.remove();
      // remove logged in status.
      this.$patch({ isLoggedIn: false });
      // clear profile store.
      await useProfileStore().clearCache();
      // redirect to login page if needed.
      if (redirect) toolkit.redirectToLogin();
    },
  },
});
