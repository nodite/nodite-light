import { NavigationConfig } from '@/types/config';

export default [
  {
    path: '/auth',
    redirect: '/auth/signin',
    meta: {
      icon: 'mdi-file-lock-outline',
      iKey: 'menu.auth',
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
          iKey: 'menu.authLogin',
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
          iKey: 'menu.authRegister',
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
          iKey: 'menu.authVerify',
          iType: 'menu',
          hidden: true,
          layout: 'auth',
          title: 'VerifyEmail',
        },
      },
    ],
  },
] as NavigationConfig.Router[];
