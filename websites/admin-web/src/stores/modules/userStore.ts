/*
 * File: userStore.ts                                                          *
 * Project: @nodite-light/admin-web                                            *
 * Created Date: Sa Dec 2023                                                   *
 * Author: Oscaner Miao                                                        *
 * -----                                                                       *
 * Last Modified: Sat Dec 30 2023                                              *
 * Modified By: Oscaner Miao                                                   *
 * -----                                                                       *
 * Copyright (c) 2023 @nodite                                                  *
 * ----------	---	---------------------------------------------------------    *
 */

import lodash from 'lodash';

import { IUser } from '@/api/admin/data-contracts';
import * as UserApi from '@/api/admin/User';

export type UserState = {
  users: IUser[];
};

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
    async list(query?: IUser): Promise<IUser[]> {
      if (lodash.isEmpty(this.users)) {
        this.users = (await UserApi.adminUserList(query || ({} as IUser))) || [];
      }
      return this.users;
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
     * Create user.
     * @param user
     */
    async create(user: IUser): Promise<void> {
      await UserApi.adminUserCreate(user);
      await this.$reset();
    },

    /**
     * Update user.
     * @param user
     */
    async edit(user: IUser): Promise<void> {
      await UserApi.adminUserEdit(user.userId, lodash.omit(user, ['username', 'password']));
      await this.$reset();
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
      await this.$reset();
    },
  },
});
