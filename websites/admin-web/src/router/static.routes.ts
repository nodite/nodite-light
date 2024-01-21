import { NavigationConfig } from '@/types/config';

export default [
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
        meta: {
          title: 'Homepage',
          hidden: true,
        },
      },
    ],
  },

  // Auth Routes.
  {
    path: '/auth',
    redirect: '/auth/signin',
    meta: {
      icon: 'mdi-file-lock-outline',
      iType: 'directory',
      hidden: true,
      title: 'Auth Pages',
      inWhiteList: true,
    },
    children: [
      {
        name: 'auth-signin',
        path: '/auth/signin',
        component: () =>
          import(/* webpackChunkName: "auth-signin" */ '@/views/auth/SigninPage.vue'),
        meta: {
          icon: 'mdi-login',
          iType: 'menu',
          hidden: true,
          layout: 'auth',
          title: 'SignIn',
          inWhiteList: true,
        },
      },
      {
        path: '/auth/signup',
        component: () =>
          import(/* webpackChunkName: "auth-signup" */ '@/views/auth/SignupPage.vue'),
        meta: {
          icon: 'mdi-logout',
          iType: 'menu',
          hidden: true,
          layout: 'auth',
          title: 'SignUp',
          inWhiteList: true,
        },
      },
      {
        path: '/auth/verify-email',
        component: () =>
          import(/* webpackChunkName: "verify-email" */ '@/views/auth/VerifyEmailPage.vue'),
        meta: {
          icon: 'mdi-email-check',
          iType: 'menu',
          hidden: true,
          layout: 'auth',
          title: 'VerifyEmail',
        },
      },
    ],
  },
] as NavigationConfig.Router[];
