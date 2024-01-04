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

type MenuState = {
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
     * List.
     * @returns
     */
    async list(): Promise<IMenu[]> {
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
     * List tree.
     * @returns
     */
    async listTree(): Promise<MenuTree[]> {
      if (lodash.isEmpty(this.menuTree)) {
        this.menuTree = (await MenuApi.adminMenuTree()) || [];
      }
      return this.menuTree;
    },

    /**
     * Query.
     * @param id
     * @returns
     */
    async query(id: number): Promise<IMenu | undefined> {
      return await MenuApi.adminMenuQuery(id);
    },

    /**
     * Create.
     * @param menu
     */
    async create(menu: IMenu): Promise<void> {
      await MenuApi.adminMenuCreate(lodash.omit(menu, ['menuId']));
      await this.$reset();
    },

    /**
     * Edit.
     * @param menu
     */
    async edit(menu: IMenu): Promise<void> {
      await MenuApi.adminMenuEdit(menu.menuId, lodash.omit(menu, ['menuId']));
      await this.$reset();
    },

    /**
     * Delete.
     * @param id
     */
    async delete(id: number): Promise<void> {
      await MenuApi.adminMenuDelete(id);
      await this.$reset();
    },
  },
});
