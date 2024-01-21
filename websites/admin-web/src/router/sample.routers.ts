import LandingRoutes from '@/router/landing.routes';

export default [
  // lottie Animation
  {
    iType: 'overline',
    meta: {
      title: 'UI - Theme Preview',
    },
    children: [
      {
        icon: 'mdi-animation-outline',
        iType: 'menu',
        path: '/ui/lottie-animation',
        component: () =>
          import(
            /* webpackChunkName: "ui-lottie-animation" */ '@/views/ui/LottieAnimationPage.vue'
          ),
        meta: {
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
];
