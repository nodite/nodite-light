/*
 * File: profileStore.ts                                                       *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: We Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Wed Jan 03 2024                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 - 2024 @nodite                                           *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import { IUser } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useNavStore } from '@/stores/modules/navStore';
import { useRoleStore } from '@/stores/modules/roleStore';
import { useUserStore } from '@/stores/modules/userStore';

import { useLocaleStore } from './localeStore';

interface ProfileState {
  profile: IUser | undefined;
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: undefined,
  }),

  persist: [{ storage: sessionStorage }],

  getters: {},

  actions: {
    /**
     * Get profiles.
     * @returns
     */
    async getProfile() {
      if (lodash.isEmpty(this.profile)) {
        this.profile = await UserApi.adminUserCurr();
      }
      return this.profile;
    },

    /**
     * Clear cache with current user.
     */
    async clearCache() {
      await this.$reset();
      await useMenuStore().$reset();
      await useNavStore().$reset();
      await useUserStore().$reset();
      await useRoleStore().$reset();
      await useLocaleStore().$reset();
    },
  },
});
