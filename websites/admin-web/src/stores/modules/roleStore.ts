/*
 * File: roleStore.ts                                                          *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: Tu Jan 2024                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Tue Jan 02 2024                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2024 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import {
  IRole,
  IUserWithRoles,
  PickIMenuMenuIdOrPerms,
  QueryParams,
  SequelizePaginationIRole,
} from '@/api/admin/data-contracts';
import * as RoleApi from '@/api/admin/Role';

type RoleState = {
  roles: IRole[];
};

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
      await this.$reset();
    },
    /**
     * Edit.
     * @param role
     */
    async edit(role: IRole): Promise<void> {
      await RoleApi.adminRoleEdit(role.roleId, lodash.omit(role, ['roleId', 'roleKey']));
      await this.$reset();
    },
    /**
     * Delete.
     * @param id
     */
    async delete(id: number): Promise<void> {
      await RoleApi.adminRoleDelete(id);
      await this.$reset();
    },
    /**
     * List menu perms.
     * @param roleId
     * @returns
     */
    async listMenuPerms(roleId: number): Promise<PickIMenuMenuIdOrPerms[] | undefined> {
      return await RoleApi.adminRolePermsList(roleId);
    },
    /**
     * Update menu perms.
     * @param roleId
     * @param menuIds
     */
    async updateMenuPerms(roleId: number, menuIds: number[]): Promise<void> {
      await RoleApi.adminRolePermsUpdate(roleId, menuIds);
    },
    /**
     * List role's users.
     * @param roleId
     * @returns
     */
    async listRoleUsers(roleId: number): Promise<IUserWithRoles[] | undefined> {
      return await RoleApi.adminRoleUsersList(roleId);
    },
    /**
     * Assign role to users.
     * @param roleId
     * @param userIds
     * @returns
     */
    async assignRoleToUsers(roleId: number, userIds: number[]): Promise<void> {
      return await RoleApi.adminRoleUsersAssign(roleId, userIds);
    },
    /**
     * Unassign role of users.
     * @param roleId
     * @param userIds
     * @returns
     */
    async unassignRoleOfUsers(roleId: number, userIds: number[]): Promise<void> {
      return await RoleApi.adminRoleUsersUnassign(roleId, userIds);
    },
  },
});
