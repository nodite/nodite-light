import { IProfile } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';
import { useAuthStore } from '@/stores/modules/authStore';
import { useLocaleStore } from '@/stores/modules/localeStore';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useNavStore } from '@/stores/modules/navStore';
import { useRoleStore } from '@/stores/modules/roleStore';
import { useUserStore } from '@/stores/modules/userStore';
import lodash from '@/utils/lodash';

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
    /**
     * Clear cache with current user.
     */
    async clearCache(): Promise<void> {
      await this.$reset();
      await useMenuStore().$reset();
      await useNavStore().$reset();
      await useUserStore().$reset();
      await useRoleStore().$reset();
      await useLocaleStore().$reset();
    },
  },
});
