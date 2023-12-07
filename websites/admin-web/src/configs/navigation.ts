import menuLanding from './menus/landing.menu';
import menuPages from './menus/pages.menu';
import menuUI from './menus/ui.menu';

export default {
  menu: [
    {
      text: '',
      key: '',
      items: [
        {
          key: 'menu.dashboard',
          text: 'Dashboard',
          link: '/dashboard',
          icon: 'mdi-view-dashboard-outline',
        },
      ],
    },

    {
      text: 'Landing',
      items: [...menuLanding],
    },
    {
      text: 'UI - Theme Preview',
      items: menuUI,
    },
    {
      text: 'Pages',
      key: 'menu.pages',
      items: menuPages,
    },
  ],
};
