import { NavigationConfig } from '@/types/config';

export default [
  {
    icon: 'mdi-dots-hexagon',
    iKey: 'menu.toolbarPage',
    iType: 'menu',
    name: 'landing-toolbar',
    path: '/landing/toolbar',
    component: () => import(/* webpackChunkName: "landing-toolbar" */ '@/views/landing/toolbar/ToolbarPage.vue'),
    meta: {
      requiresAuth: true,
      layout: 'landing',
    },
  },
] as NavigationConfig.Router[];
