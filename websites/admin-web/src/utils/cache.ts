import { toast } from 'vuetify-sonner';

import * as CacheApi from '@/api/admin/Cache';
import { useLocaleStore } from '@/stores/modules/localeStore';
import { useMenuStore } from '@/stores/modules/menuStore';
import { useNavStore } from '@/stores/modules/navStore';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useRoleStore } from '@/stores/modules/roleStore';

const cacheMethods = {
  invalidation: {
    all: async () => {
      await CacheApi.adminCacheInvalidate({ type: 'all' });
      cacheMethods.invalidateStore.all();
      toast.success('All cache cleared');
    },
    profile: () => {
      cacheMethods.invalidateStore.profile();
      toast.success('Profile cache cleared');
    },
    'menu/nav': async () => {
      await CacheApi.adminCacheInvalidate({ type: 'menu' });
      cacheMethods.invalidateStore['menu/nav']();
      toast.success('Menu cache cleared');
    },
    locale: async () => {
      await CacheApi.adminCacheInvalidate({ type: 'locale' });
      cacheMethods.invalidateStore.locale();
      toast.success('Locale cache cleared');
    },
    perms: async () => {
      await CacheApi.adminCacheInvalidate({ type: 'perms' });
      cacheMethods.invalidateStore.perms();
      toast.success('Perms cache cleared');
    },
  },
  invalidateStore: {
    all: () => {
      cacheMethods.invalidateStore.profile();
      cacheMethods.invalidateStore['menu/nav']();
      cacheMethods.invalidateStore.locale();
      cacheMethods.invalidateStore.perms();
    },
    profile: () => {
      useProfileStore().$reset();
    },
    'menu/nav': () => {
      useMenuStore().$reset();
      useNavStore().$reset();
    },
    locale: () => {
      useLocaleStore().$reset();
    },
    perms: () => {
      useRoleStore().$reset();
    },
  },
};

export default cacheMethods;
