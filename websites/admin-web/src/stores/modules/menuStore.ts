import { DataTreeIMenu, IMenu } from '@/api/admin/data-contracts';
import * as MenuApi from '@/api/admin/Menu';
import lodash from '@/utils/lodash';

interface MenuState {
  menuList: IMenu[];
  menuTree: DataTreeIMenu[];
}

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
      if (!lodash.isEmpty(this.menuList)) return this.menuList;
      this.menuList = lodash.map((await MenuApi.adminMenuList()) || [], (item) => {
        return {
          ...item,
          parentId: item.parentId || '',
        };
      });
      return this.menuList;
    },

    /**
     * List tree.
     * @returns
     */
    async listTree(): Promise<DataTreeIMenu[]> {
      if (!lodash.isEmpty(this.menuTree)) return this.menuTree;
      this.menuTree = (await MenuApi.adminMenuTree()) || [];
      return this.menuTree;
    },

    /**
     * Query.
     * @param id
     * @returns
     */
    async query(id: string): Promise<IMenu | undefined> {
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
    async delete(id: string): Promise<void> {
      await MenuApi.adminMenuDelete(id);
      await this.$reset();
    },
  },
});
