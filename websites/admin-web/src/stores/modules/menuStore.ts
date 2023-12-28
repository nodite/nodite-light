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

    async editMenu(menu: IMenu | MenuTree): Promise<void> {
      console.log(menu);
    },

    async deleteMenu(menu: IMenu | MenuTree): Promise<void> {
      console.log(menu);
    },
  },
});
