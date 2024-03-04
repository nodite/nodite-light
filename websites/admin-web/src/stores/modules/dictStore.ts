import {
  DataTreeIDictGroup,
  IDictGroup,
  IDictItem,
  IDictType,
  IDictTypeWithItems,
  QueryParams,
  SequelizePaginationIDictItem,
  SequelizePaginationIDictTypeWithItems,
} from '@/api/admin/data-contracts';
import * as DictApi from '@/api/admin/Dict';
import lodash from '@/utils/lodash';

interface DictState {
  groupTree: DataTreeIDictGroup[];
}

export const useDictStore = defineStore('dict', {
  state: (): DictState => ({
    groupTree: [],
  }),

  persist: [{ storage: localStorage, paths: ['groupTree'] }],

  actions: {
    /**
     * List group.
     * @returns
     */
    async listGroup(): Promise<IDictGroup[]> {
      return (await DictApi.adminDictGroupList()) || [];
    },
    /**
     * List group tree.
     * @returns
     */
    async listGroupTree(force: boolean = false): Promise<DataTreeIDictGroup[]> {
      if (lodash.isEmpty(this.groupTree) || force) {
        this.groupTree = (await DictApi.adminDictGroupTree()) || [];
      }
      return this.groupTree;
    },
    /**
     * Query group.
     * @param id
     * @returns
     */
    async queryGroup(id: string): Promise<IDictGroup | undefined> {
      return await DictApi.adminDictGroupQuery(id);
    },
    /**
     * Create group.
     * @param group
     */
    async createGroup(group: IDictGroup): Promise<void> {
      await DictApi.adminDictGroupCreate(lodash.omit(group, ['groupId']));
    },
    /**
     * Edit group.
     * @param group
     */
    async editGroup(group: IDictGroup): Promise<void> {
      await DictApi.adminDictGroupEdit(group.groupId, lodash.omit(group, ['groupId', 'groupKey']));
    },
    /**
     * Delete group.
     * @param id
     */
    async deleteGroup(id: string): Promise<void> {
      await DictApi.adminDictGroupDelete(id);
    },

    /**
     * List type.
     * @param groupId
     * @returns
     */
    async listType(
      params?: QueryParams,
    ): Promise<SequelizePaginationIDictTypeWithItems | undefined> {
      return await DictApi.adminDictTypeList(params);
    },
    /**
     * Query type.
     * @param id
     * @returns
     */
    async queryType(id: string): Promise<IDictTypeWithItems | undefined> {
      return await DictApi.adminDictTypeQuery(id);
    },
    /**
     * Create type.
     * @param type
     */
    async createType(type: IDictType): Promise<void> {
      await DictApi.adminDictTypeCreate(lodash.omit(type, ['dictId']));
    },
    /**
     * Edit type.
     * @param type
     */
    async editType(type: IDictType): Promise<void> {
      await DictApi.adminDictTypeEdit(type.dictKey, lodash.omit(type, ['dictId', 'dictKey']));
    },
    /**
     * Delete type.
     * @param id
     */
    async deleteType(id: string): Promise<void> {
      await DictApi.adminDictTypeDelete(id);
    },

    /**
     * List item.
     * @param params
     * @returns
     */
    async listItem(params?: QueryParams): Promise<SequelizePaginationIDictItem | undefined> {
      return await DictApi.adminDictItemList(params);
    },
    /**
     * Query item.
     * @param id
     * @returns
     */
    async queryItem(id: number): Promise<IDictItem | undefined> {
      return await DictApi.adminDictItemQuery(id);
    },
    /**
     * Create item.
     * @param item
     */
    async createItem(item: IDictItem): Promise<void> {
      await DictApi.adminDictItemCreate(lodash.omit(item, ['itemId']));
    },
    /**
     * Edit item.
     * @param item
     */
    async editItem(item: IDictItem): Promise<void> {
      await DictApi.adminDictItemEdit(
        item.itemId,
        lodash.omit(item, ['itemId', 'dictKey', 'itemKey']),
      );
    },
    /**
     * Delete item.
     * @param id
     */
    async deleteItem(id: number): Promise<void> {
      await DictApi.adminDictItemDelete(id);
    },
  },
});
