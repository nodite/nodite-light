import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import AuthRoutes from './auth.routes';
import LandingRoutes from './landing.routes';

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
    path: '/ui/lottie-animation',
    name: 'ui-lottie-animation',
    component: () => import(/* webpackChunkName: "ui-lottie-animation" */ '@/views/ui/LottieAnimationPage.vue'),
    meta: {
      requiresAuth: true,
      layout: 'ui',
      category: 'UI',
      title: 'LottieAnimation',
    },
  },

  ...LandingRoutes,
  ...AuthRoutes,
] as RouteRecordRaw[];

export const dynamicRoutes = [];

const router = createRouter({
  history: createWebHistory(),
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
