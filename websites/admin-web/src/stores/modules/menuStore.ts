/*
 * File: menuStore.ts                                                          *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: Sa Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Sat Dec 23 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import { IMenu, MenuTree } from '@/api/admin/data-contracts';
import * as MenuApi from '@/api/admin/Menu';

export type MenuState = {
  menuList: IMenu[];
  menuTree: MenuTree[];
};

export const useMenuStore = defineStore('menu', {
  state: (): MenuState => ({
    menuList: [],
    menuTree: [],
  }),

  persist: [{ storage: sessionStorage }],

  actions: {
    /**
     * Get menu list.
     * @returns
     */
    async getMenuList(): Promise<IMenu[]> {
      if (lodash.isEmpty(this.menuList)) {
        this.menuList = lodash.map((await MenuApi.adminMenuList()) || [], (item) => {
          return {
            ...item,
            parentId: item.parentId || 0,
          };
        });
      }
      return this.menuList;
    },

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

    async createMenu(menu: IMenu): Promise<void> {
      await MenuApi.adminMenuCreate(menu);
      await this.$reset();
    },

    async updateMenu(menu: IMenu): Promise<void> {
      await MenuApi.adminMenuEdit(menu.menuId, menu);
      await this.$reset();
    },

    async deleteMenu(id: number): Promise<void> {
      await MenuApi.adminMenuDelete(id);
      await this.$reset();
    },
  },
});
