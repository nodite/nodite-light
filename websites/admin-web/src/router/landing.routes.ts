import { NavigationConfig } from '@/types/config';

export default [
  {
    path: '/landing/toolbar',
    component: () =>
      import(/* webpackChunkName: "landing-toolbar" */ '@/views/landing/toolbar/ToolbarPage.vue'),
    meta: {
      icon: 'mdi-dots-hexagon',
      iKey: 'menu.toolbarPage',
      iType: 'menu',
      layout: 'landing',
    },
  },
] as NavigationConfig.Router[];
