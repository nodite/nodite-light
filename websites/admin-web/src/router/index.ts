import lodash from 'lodash';
import { createRouter, createWebHistory } from 'vue-router';

import i18n from '@/plugins/i18n';
import AuthRoutes from '@/router/auth.routes';
import { useAppStore } from '@/stores/modules/appStore';
import { useAuthStore } from '@/stores/modules/authStore';
import { useNavStore } from '@/stores/modules/navStore';
import { useProfileStore } from '@/stores/modules/profileStore';
import { useSnackbarStore } from '@/stores/modules/snackbarStore';
import { NavigationConfig } from '@/types/config';
import * as toolkit from '@/utils/request/toolkit';
import * as url from '@/utils/url';

export const staticRoutes = [
  {
    path: '/:pathMatch(.*)*',
    component: () => import(/* webpackChunkName: "error" */ '@/views/errors/NotFoundPage.vue'),
    meta: {
      inWhiteList: false,
      hidden: true,
    },
  },
  {
    path: '',
    redirect: '/index',
    meta: {
      layout: 'landing',
      hidden: true,
    },
    children: [
      {
        path: '/index',
        component: () => import('@/views/Index.vue'),
        name: 'Index',
        meta: {
          title: 'Homepage',
          hidden: true,
        },
      },
    ],
  },

  // Auth Routes.
  ...AuthRoutes,
] as NavigationConfig.Router[];

export const dynamicRoutes = [] as NavigationConfig.Router[];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH || '/'),
  // hash模式：createWebHashHistory，history模式：createWebHistory
  // process.env.NODE_ENV === "production"

  routes: [...staticRoutes, ...dynamicRoutes],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

router.beforeEach(async (to, from) => {
  // Start loading.
  useAppStore().setGlobalLoading(true);

  const authStore = useAuthStore();

  // Not need auth.
  if (to.meta?.inWhiteList) {
    return;
  }
  // Need auth, but unauthorized.
  if (!toolkit.token.get() || !authStore.isLoggedIn) {
    toolkit.redirectToLogin(i18n.global.t('common.noSignIn'));
    return false;
  }

  const profileStore = useProfileStore();
  const navStore = useNavStore();
  try {
    if (!navStore.isRouterReady) {
      console.log('refresh routers');
      // Waiting profile ready.
      await profileStore.getProfile();

      // Get routers.
      const navRouters = await navStore.getRouters();

      for (const navRouter of navRouters) {
        if (url.isHttp(navRouter.path)) {
          continue;
        }
        router.addRoute(navRouter);
      }

      // Get sidebar.
      await navStore.getSidebar();

      lodash.unset(to, 'name');
      return lodash.merge(to, { replace: true });
    }
  } catch (error) {
    await profileStore.$reset();
    await navStore.$reset();
    await authStore.logout(false);
    toolkit.redirectToLogin(String(error));
    return false;
  }
});

router.afterEach(() => {
  // End loading.
  useAppStore().setGlobalLoading(false);
});

export default router;
