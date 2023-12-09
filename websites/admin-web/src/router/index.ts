import { createRouter, createWebHistory } from 'vue-router';

import { NavigationConfig } from '@/types/config';

import AuthRoutes from './auth.routes';
import LandingRoutes from './landing.routes';

export const dynamicRoutes = [];

export const routes = [
  {
    path: '/',
    redirect: '/dashboard',
    meta: {},
  },
  {
    path: '/dashboard',
    meta: {
      requiresAuth: true,
      layout: 'landing',
    },
    component: () => import('@/views/pages/DashBoard.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'error',
    component: () => import(/* webpackChunkName: "error" */ '@/views/errors/NotFoundPage.vue'),
  },

  // lottie Animation
  {
    iType: 'overline',
    meta: {
      title: 'UI - Theme Preview',
    },
    children: [
      {
        icon: 'mdi-animation-outline',
        iKey: 'menu.lottieAnimation',
        iType: 'menu',
        path: '/ui/lottie-animation',
        name: 'ui-lottie-animation',
        component: () => import(/* webpackChunkName: "ui-lottie-animation" */ '@/views/ui/LottieAnimationPage.vue'),
        meta: {
          requiresAuth: true,
          layout: 'ui',
          category: 'UI',
          title: 'Lottie Animation',
        },
      },
    ],
  },

  {
    iType: 'overline',
    meta: {
      title: 'Landing',
    },
    children: [...LandingRoutes],
  },

  {
    iType: 'overline',
    iKey: 'menu.pages',
    meta: {
      title: 'Pages',
    },
    children: [...AuthRoutes],
  },

  ...dynamicRoutes,
] as NavigationConfig.Router[];

const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_APP_BASE_PATH || '/'),
  // hash模式：createWebHashHistory，history模式：createWebHistory
  // process.env.NODE_ENV === "production"

  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
