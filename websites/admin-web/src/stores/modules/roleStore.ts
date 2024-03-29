import lodash from 'lodash';

import {
  IRole,
  IUserWithRoles,
  PickIMenuMenuIdOrPerms,
  QueryParams,
  SequelizePaginationIRole,
} from '@/api/admin/data-contracts';
import * as RoleApi from '@/api/admin/Role';

interface RoleState {
  roles: IRole[];
}

export const useRoleStore = defineStore('role', {
  state: (): RoleState => ({
    roles: [],
  }),

  persist: [{ storage: sessionStorage }],

  actions: {
    /**
     * List.
     * @param params
     * @returns
     */
    async list(params?: QueryParams): Promise<SequelizePaginationIRole | undefined> {
      return await RoleApi.adminRoleList(params);
    },
    /**
     * Query.
     * @param id
     * @returns
     */
    async query(id: number): Promise<IRole | undefined> {
      return await RoleApi.adminRoleQuery(id);
    },
    /**
     * Create.
     * @param role
     */
    async create(role: IRole): Promise<void> {
      await RoleApi.adminRoleCreate(lodash.omit(role, ['roleId']));
    },
    /**
     * Edit.
     * @param role
     */
    async edit(role: IRole): Promise<void> {
      await RoleApi.adminRoleEdit(role.roleId, lodash.omit(role, ['roleId', 'roleKey']));
    },
    /**
     * Delete.
     * @param id
     */
    async delete(id: number): Promise<void> {
      await RoleApi.adminRoleDelete(id);
    },
    /**
     * List menu perms.
     * @param roleId
     * @returns
     */
    async listMenuPerms(roleId: number): Promise<PickIMenuMenuIdOrPerms[] | undefined> {
      return await RoleApi.adminRolePermList(roleId);
    },
    /**
     * Update menu perms.
     * @param roleId
     * @param menuIds
     */
    async updateMenuPerms(roleId: number, menuIds: string[]): Promise<void> {
      await RoleApi.adminRolePermUpdate(roleId, menuIds);
    },
    /**
     * List role's users.
     * @param roleId
     * @returns
     */
    async listRoleUsers(roleId: number): Promise<IUserWithRoles[] | undefined> {
      return await RoleApi.adminRoleUserList(roleId);
    },
    /**
     * Assign role to users.
     * @param roleId
     * @param userIds
     * @returns
     */
    async assignRoleToUsers(roleId: number, userIds: number[]): Promise<void> {
      return await RoleApi.adminRoleUserAssign(roleId, userIds);
    },
    /**
     * Unassign role of users.
     * @param roleId
     * @param userIds
     * @returns
     */
    async unassignRoleOfUsers(roleId: number, userIds: number[]): Promise<void> {
      return await RoleApi.adminRoleUserUnassign(roleId, userIds);
    },
  },
});
