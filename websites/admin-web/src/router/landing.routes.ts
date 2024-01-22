import { NavigationConfig } from '@/types/config';

export default [
  {
    path: '/landing/toolbar',
    component: () =>
      import(/* webpackChunkName: "landing-toolbar" */ '@/views/landing/toolbar/ToolbarPage.vue'),
    meta: {
      icon: 'mdi-dots-hexagon',
      iType: 'menu',
      layout: 'landing',
    },
  },
] as NavigationConfig.Route[];
