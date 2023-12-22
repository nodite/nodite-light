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

import { MenuTree } from '@/api/admin/data-contracts';
import * as MenuApi from '@/api/admin/Menu';
import { staticRoutes } from '@/router';
import { NavigationConfig } from '@/types/config';
import * as navUtil from '@/utils/navigation';

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
    isRouterReady(state: NavState): boolean {
      return !lodash.isEmpty(state.routers);
    },
  },

  actions: {
    /**
     * Get menu tree.
     * @returns
     */
    async getMenuTree(): Promise<MenuTree[]> {
      if (lodash.isEmpty(this.menuTree)) {
        this.menuTree = (await MenuApi.adminMenuTree()) || [];
      }
      return this.menuTree;
    },

    /**
     * Get routers.
     * @returns
     */
    async getRouters(): Promise<NavigationConfig.Router[]> {
      if (lodash.isEmpty(this.routers)) {
        this.routers = navUtil.convertMenuTreeToRouter(await this.getMenuTree()) || [];
      }
      return this.routers;
    },

    /**
     * Get sidebar.
     * @returns
     */
    async getSidebar(): Promise<NavigationConfig.Router[]> {
      if (lodash.isEmpty(this.sidebar)) {
        this.sidebar = [...staticRoutes, ...(await this.getRouters())].filter((route) => {
          // remove non-root menu.
          return route.meta?.parentId === undefined || route.meta?.parentId === 0;
        });
      }
      return this.sidebar;
    },
  },
});
