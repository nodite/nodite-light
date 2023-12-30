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
    async getUsers(query?: IUser): Promise<IUser[]> {
      if (lodash.isEmpty(this.users)) {
        this.users = (await UserApi.adminUserList(query || ({} as IUser))) || [];
      }
      return this.users;
    },
    async createUser(user: IUser): Promise<void> {
      await UserApi.adminUserCreate(user);
      await this.$reset();
    },
    async updateUser(user: IUser): Promise<void> {
      await UserApi.adminUserEdit(user.userId, lodash.omit(user, ['username', 'password']));
      await this.$reset();
    },
    async resetPassword(id: number, password: string, confirmPassword: string): Promise<void> {
      await UserApi.adminUserResetPassword(id, { password, confirmPassword });
    },
    async deleteUser(id: number): Promise<void> {
      await UserApi.adminUserDelete(id);
      await this.$reset();
    },
  },
});
