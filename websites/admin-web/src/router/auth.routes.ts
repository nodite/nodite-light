import { NavigationConfig } from '@/types/config';

export default [
  {
    icon: 'mdi-file-lock-outline',
    iKey: 'menu.auth',
    iType: 'directory',
    path: '/auth',
    redirect: '/auth/signin',
    meta: {
      hidden: true,
      title: 'Auth Pages',
      inWhiteList: true,
    },
    children: [
      {
        icon: 'mdi-login',
        iKey: 'menu.authLogin',
        iType: 'menu',
        path: '/auth/signin',
        component: () =>
          import(/* webpackChunkName: "auth-signin" */ '@/views/auth/SigninPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'SignIn',
          inWhiteList: true,
        },
      },
      {
        icon: 'mdi-logout',
        iKey: 'menu.authRegister',
        iType: 'menu',
        path: '/auth/signup',
        component: () =>
          import(/* webpackChunkName: "auth-signup" */ '@/views/auth/SignupPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'SignUp',
          inWhiteList: true,
        },
      },
      {
        icon: 'mdi-email-check',
        iKey: 'menu.authVerify',
        iType: 'menu',
        path: '/auth/verify-email',
        component: () =>
          import(/* webpackChunkName: "verify-email" */ '@/views/auth/VerifyEmailPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'VerifyEmail',
        },
      },
    ],
  },
] as NavigationConfig.Router[];
