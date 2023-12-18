import lodash from 'lodash';

import { MenuTree } from '@/api/admin/data-contracts';
import * as MenuApi from '@/api/admin/Menu';
import { staticRoutes } from '@/router';
import { NavigationConfig } from '@/types/config';

// load all views.
const views = import.meta.glob('@/views/**/*.vue');

export type NavState = {
  menuTree: MenuTree[];
  routers: NavigationConfig.Router[];
  sidebar: NavigationConfig.Router[];
};

export const useNavStore = defineStore('nav', {
  state: (): NavState => ({
    menuTree: [],
    routers: [],
    sidebar: [],
  }),

  persist: [{ storage: sessionStorage, paths: ['menuTree', 'sidebar'] }],

  getters: {
    isRouterReady(state): boolean {
      return !lodash.isEmpty(state.routers);
    },
  },

  actions: {
    /**
     * Get menu tree.
     * @returns
     */
    async getMenuTree() {
      if (lodash.isEmpty(this.menuTree)) {
        this.menuTree = (await MenuApi.adminMenuTree()) || [];
      }
      return this.menuTree;
    },

    /**
     * Get routers.
     * @returns
     */
    async getRouters() {
      if (lodash.isEmpty(this.routers)) {
        this.routers = this._convertMenuTreeToRouter(await this.getMenuTree()) || [];
      }
      return this.routers;
    },

    /**
     * Get sidebar.
     * @returns
     */
    async getSidebar() {
      if (lodash.isEmpty(this.sidebar)) {
        this.sidebar = [...staticRoutes, ...(await this.getRouters())].filter((route) => {
          // remove non-root menu.
          return route.meta?.parentId === undefined || route.meta?.parentId === 0;
        });
      }
      return this.sidebar;
    },

    /**
     * Convert menu tree to routers.
     * @param menuTree
     * @returns
     */
    _convertMenuTreeToRouter(menuTree?: MenuTree[]): NavigationConfig.Router[] | undefined {
      return lodash.map(menuTree, (menu) => {
        const router = {
          icon: menu.icon || undefined,
          iKey: menu.iKey || undefined,
          iType: menu.iType as NavigationConfig.Router['iType'],
          path: menu.path,
          redirect: menu.redirect || undefined,
          component: this._loadComponent(menu.component),
          meta: {
            parentId: menu.parentId || undefined,
            disabled: menu.status === 0,
            hidden: menu.hidden,
            layout: menu.layout,
            title: menu.name,
          },
        } as NavigationConfig.Router;

        if (!router.component) {
          delete router.component;
        }

        if (menu.children && menu.children.length > 0) {
          router.children = this._convertMenuTreeToRouter(menu.children);
        } else {
          delete router.children;
        }

        return router;
      });
    },

    /**
     * Load component.
     * @param component
     * @returns
     */
    _loadComponent(component: string) {
      const importView = lodash.find(views, (value, key) => {
        return key.endsWith(`views/${component}.vue`);
      });
      return importView ? () => importView() : undefined;
    },
  },
});
