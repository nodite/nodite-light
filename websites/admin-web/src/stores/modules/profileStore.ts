import lodash from 'lodash';

import { IProfile } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';
import { useAuthStore } from '@/stores/modules/authStore';

interface ProfileState {
  profile: IProfile;
  perms: { [key: string]: boolean };
}

export const useProfileStore = defineStore('profile', {
  state: (): ProfileState => ({
    profile: {} as IProfile,
    perms: {},
  }),

  persist: [{ storage: sessionStorage }],

  getters: {},

  actions: {
    /**
     * Get profiles.
     * @returns
     */
    async getProfile(force: boolean = false): Promise<IProfile> {
      if (lodash.isEmpty(this.profile) || force) {
        this.profile = (await UserApi.adminUserProfile()) || ({} as IProfile);
      }
      return this.profile;
    },
    /**
     * Has perms.
     * @param perms
     * @returns
     */
    async hasPerm(perm: string): Promise<boolean> {
      if (!useAuthStore().isAuthorized) return false;

      if (lodash.has(this.perms, perm)) return lodash.get(this.perms, perm);

      const profile = await this.getProfile();

      lodash.set(
        this.perms,
        perm,
        lodash.includes(profile.perms, '*:*:*') ? true : lodash.includes(profile.perms, perm),
      );

      return lodash.get(this.perms, perm);
    },
    /**
     * Is admin.
     * @returns
     */
    async isAdmin(): Promise<boolean> {
      if (!useAuthStore().isAuthorized) return false;

      const profile = await this.getProfile();

      if (profile.userId === 1) return true;

      return lodash.includes(profile.roles, 'admin');
    },
  },
});
