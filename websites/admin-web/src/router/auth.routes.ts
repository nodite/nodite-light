import { NavigationConfig } from '@/types/config';

export default [
  {
    icon: 'mdi-file-lock-outline',
    iKey: 'menu.auth',
    iType: 'directory',
    name: 'auth-pages',
    path: '/auth',
    redirect: '/auth/signin',
    meta: {
      hidden: true,
      title: 'Auth Pages',
      noAuth: true,
    },
    children: [
      {
        icon: 'mdi-login',
        iKey: 'menu.authLogin',
        iType: 'menu',
        path: '/auth/signin',
        name: 'auth-signin',
        component: () => import(/* webpackChunkName: "auth-signin" */ '@/views/auth/SigninPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'SignIn',
          noAuth: true,
        },
      },
      {
        icon: 'mdi-logout',
        iKey: 'menu.authRegister',
        iType: 'menu',
        path: '/auth/signup',
        name: 'auth-signup',
        component: () => import(/* webpackChunkName: "auth-signup" */ '@/views/auth/SignupPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'SignUp',
          noAuth: true,
        },
      },
      {
        icon: 'mdi-email-check',
        iKey: 'menu.authVerify',
        iType: 'menu',
        path: '/auth/verify-email',
        name: 'verify-email',
        component: () => import(/* webpackChunkName: "verify-email" */ '@/views/auth/VerifyEmailPage.vue'),
        meta: {
          hidden: true,
          layout: 'auth',
          title: 'VerifyEmail',
          noAuth: false,
        },
      },
    ],
  },
] as NavigationConfig.Router[];
