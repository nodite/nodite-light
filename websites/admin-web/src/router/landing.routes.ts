import { NavigationConfig } from '@/types/config';

export default [
  {
    icon: 'mdi-dots-hexagon',
    iKey: 'menu.toolbarPage',
    iType: 'menu',
    path: '/landing/toolbar',
    component: () =>
      import(/* webpackChunkName: "landing-toolbar" */ '@/views/landing/toolbar/ToolbarPage.vue'),
    meta: {
      layout: 'landing',
    },
  },
] as NavigationConfig.Router[];
