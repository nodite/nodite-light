import {
  IRoleWithUsers,
  IUser,
  QueryParams,
  SequelizePaginationIUser,
} from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';
import lodash from '@/utils/lodash';

interface UserState {
  users: IUser[];
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    users: [],
  }),

  persist: [{ storage: sessionStorage }],

  actions: {
    /**
     * List.
     * @param query
     * @returns
     */
    async list(params?: QueryParams): Promise<SequelizePaginationIUser | undefined> {
      return await UserApi.adminUserList(params);
    },
    /**
     * Query.
     * @param id
     * @returns
     */
    async query(id: number): Promise<IUser | undefined> {
      return await UserApi.adminUserQuery(id);
    },
    /**
     * Create.
     * @param user
     */
    async create(user: IUser): Promise<void> {
      await UserApi.adminUserCreate(lodash.omit(user, ['userId']));
    },
    /**
     * Edit.
     * @param user
     */
    async edit(user: IUser): Promise<void> {
      await UserApi.adminUserEdit(
        user.userId,
        lodash.omit(user, ['userId', 'username', 'password']),
      );
    },
    /**
     * Reset password.
     * @param id
     * @param password
     * @param confirmPassword
     */
    async resetPassword(id: number, password: string, confirmPassword: string): Promise<void> {
      await UserApi.adminUserResetPassword(id, { password, confirmPassword });
    },
    /**
     * Delete user.
     * @param id
     */
    async delete(id: number): Promise<void> {
      await UserApi.adminUserDelete(id);
    },
    /**
     * List user's roles.
     * @param userId
     * @returns
     */
    async listUserRoles(userId: number): Promise<IRoleWithUsers[] | undefined> {
      return await UserApi.adminUserRoleList(userId);
    },
    /**
     * Assign roles to user.
     * @param userId
     * @param roleIds
     */
    async assignRolesToUser(userId: number, roleIds: number[]): Promise<void> {
      await UserApi.adminUserRoleAssign(userId, roleIds);
    },
    /**
     * Unassign roles of user.
     * @param userId
     * @param roleIds
     */
    async unassignRolesOfUser(userId: number, roleIds: number[]): Promise<void> {
      await UserApi.adminUserRoleUnassign(userId, roleIds);
    },
  },
});
