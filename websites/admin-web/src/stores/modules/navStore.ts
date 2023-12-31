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

import { staticRoutes } from '@/router';
import { NavigationConfig } from '@/types/config';
import * as navUtil from '@/utils/navigation';

import { useMenuStore } from './menuStore';

export type NavState = {
  routers: NavigationConfig.Router[];
  sidebar: NavigationConfig.Menu[];
};

export const useNavStore = defineStore('nav', {
  state: (): NavState => ({
    routers: [],
    sidebar: [],
  }),

  persist: [{ storage: sessionStorage, paths: ['sidebar'] }],

  getters: {
    isRouterReady(state: NavState): boolean {
      return !lodash.isEmpty(state.routers);
    },
  },

  actions: {
    /**
     * Get routers.
     * @returns
     */
    async getRouters(): Promise<NavigationConfig.Router[]> {
      if (lodash.isEmpty(this.routers)) {
        this.routers = navUtil.convertMenuTreeToRouter(await useMenuStore().listTree()) || [];
      }
      return this.routers;
    },

    /**
     * Get sidebar.
     * @returns
     */
    async getSidebar(): Promise<NavigationConfig.Menu[]> {
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
