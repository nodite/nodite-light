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

  persist: {
    enabled: true,
    strategies: [{ storage: localStorage }],
  },

  getters: {},

  actions: {
    async getProfile() {
      if (lodash.isEmpty(this.profile)) {
        console.log('fetch profile');
        this.profile = await UserApi.curr();
      }
      return this.profile;
    },
  },
});
