/*
 * File: navStore.ts                                                           *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: We Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Thu Dec 21 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import staticRoutes from '@/router/static.routes';
import { useMenuStore } from '@/stores/modules/menuStore';
import { NavigationConfig } from '@/types/config';
import * as navUtil from '@/utils/navigation';

type NavState = {
  routesLoaded: boolean;
  routes: NavigationConfig.Router[];
  sidebarLoaded: boolean;
  sidebar: NavigationConfig.Menu[];
};

export const useNavStore = defineStore('nav', {
  state: (): NavState => ({
    routesLoaded: false,
    routes: [],
    sidebarLoaded: false,
    sidebar: [],
  }),

  persist: [{ storage: sessionStorage, paths: ['sidebarLoaded', 'sidebar'] }],

  getters: {
    isRouterReady(state: NavState): boolean {
      return state.routesLoaded;
    },
  },

  actions: {
    /**
     * Get routers.
     * @returns
     */
    async getRoutes(): Promise<NavigationConfig.Router[]> {
      if (!this.routesLoaded) {
        this.routes = navUtil.convertMenuTreeToRoutes(await useMenuStore().listTree(), true) || [];
        this.routesLoaded = true;
      }
      return this.routes;
    },

    /**
     * Get sidebar.
     * @returns
     */
    async getSidebar(): Promise<NavigationConfig.Menu[]> {
      if (!this.sidebarLoaded) {
        const routes =
          navUtil.convertMenuTreeToRoutes(await useMenuStore().listTree(), false) || [];

        this.sidebar = this._filterSideber([...staticRoutes, ...routes]).filter((route) => {
          // remove non-root menu on sidebar root.
          return lodash.toInteger(route.meta?.parentId) === 0;
        });

        this.sidebarLoaded = true;
      }
      return this.sidebar;
    },

    /**
     * Filter sidebar.
     * @description Remove disabled/hidden menu on sidebar, and their children.
     * @private
     * @param routes
     * @returns
     */
    _filterSideber(routes?: NavigationConfig.Router[]): NavigationConfig.Router[] {
      return lodash
        .chain(routes || [])
        .map((route) => {
          if (route.meta?.disabled) return null; // remove disabled menu.
          if (route.meta?.hidden) return null; // remove hidden menu.
          route.children = this._filterSideber(route.children);
          return route;
        })
        .filter()
        .value() as NavigationConfig.Router[];
    },
  },
});
