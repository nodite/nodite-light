import lodash from 'lodash';

import { IUser } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';

export type ProfileState = {
  profile: IUser | undefined;
};

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
  },
});
