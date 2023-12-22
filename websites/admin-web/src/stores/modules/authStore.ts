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

import * as AuthApi from '@/api/admin/Auth';
import { LoginBody } from '@/api/admin/data-contracts';
import i18n from '@/plugins/i18n';
import router from '@/router';
import { useProfileStore } from '@/stores/modules/profileStore';
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
      useSnackbarStore().showWarningMessage(i18n.global.t('common.maintenance'));
    },

    /**
     * Login.
     * @param userInfo
     */
    async login(userInfo: LoginBody) {
      const response = await AuthApi.adminAuthLogin(userInfo);
      toolkit.token.set(response?.token || '', response?.expiresIn);
      this.isLoggedIn = true;
      useSnackbarStore().showSuccessMessage(i18n.global.t('login.success'));
      router.push('/');
    },

    /**
     * Login with WeChat.
     */
    async loginWithWeChat() {
      useSnackbarStore().showWarningMessage('WeChat login is not supported yet.');
    },

    /**
     * Login with Google.
     */
    async loginWithGoogle() {
      useSnackbarStore().showWarningMessage('Google login is not supported yet.');
    },

    /**
     * Logout.
     * @param redirect
     */
    async logout(redirect: boolean = false) {
      await AuthApi.adminAuthLogout();
      toolkit.token.remove();
      this.$patch({ isLoggedIn: false });
      await useProfileStore().$reset();
      if (redirect) toolkit.redirectToLogin();
    },
  },
});
