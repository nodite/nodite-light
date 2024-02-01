import { createRouter, createWebHistory } from 'vue-router';

import i18n from '@/plugins/i18n';
import dynamicRoutes from '@/router/dynamic.routes';
import staticRoutes from '@/router/static.routes';
import { useAppStore } from '@/stores/modules/appStore';
import { useAuthStore } from '@/stores/modules/authStore';
import { useNavStore } from '@/stores/modules/navStore';
import { useProfileStore } from '@/stores/modules/profileStore';
import * as navUtil from '@/utils/navigation';
import * as toolkit from '@/utils/requestToolkit';
import * as url from '@/utils/url';

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

  // auth.
  const authStore = useAuthStore();
  const profileStore = useProfileStore();
  const navStore = useNavStore();
  const isAdmin = await profileStore.isAdmin();

  // Authorized no-admin user shouldn't visit auth pages.
  if (authStore.isAuthorized && !isAdmin && ['/auth/signin', '/auth/signup'].includes(to.path)) {
    return { path: '/' };
  }
  // In white list.
  else if (to.meta?.inWhiteList) {
    return;
  }
  // Unauthorized.
  else if (!authStore.isAuthorized) {
    toolkit.redirectToLogin(i18n.ndt('No signed in.'));
    return false;
  }

  // routing.
  try {
    if (!navStore.isRouterReady) {
      // Waiting profile ready.
      await profileStore.getProfile();

      // Get routers.
      const navRouters = await navUtil.getRoutes();

      for (const navRouter of navRouters) {
        // external link, or disabled.
        if (url.isHttp(navRouter.path) || navRouter.meta?.disabled) {
          continue;
        }
        router.addRoute(navRouter);
      }

      // Get sidebar.
      await navUtil.getSidebar();

      // @see https://router.vuejs.org/guide/advanced/dynamic-routing.html
      return to.fullPath;
    }
  } catch (error) {
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
