import { AuthorizedRequest } from '@nodite-light/admin-auth';
import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpContext from 'express-http-context';
import httpStatus from 'http-status';
import { Transaction } from 'sequelize';

import CasbinModel from '@/components/casbin/casbin.model';
import RoleModel from '@/components/role/role.model';
import RoleService from '@/components/role/role.service';
import RoleUserModel, { IRoleWithUsers } from '@/components/role/role_user.model';
import {
  IPasswordReset,
  IProfile,
  IUserCreate,
  IUserUpdate,
} from '@/components/user/user.interface';
import UserModel, { IUser } from '@/components/user/user.model';
import { QueryParams } from '@/interfaces';
import lodash from '@/utils/lodash';

/**
 * Class UserService.
 */
export default class UserService {
  roleService: RoleService;

  constructor() {
    this.roleService = new RoleService();
  }

  /**
   * Search users.
   * @param user
   * @returns
   */
  public async selectUserList(params?: QueryParams): Promise<SequelizePagination<IUser>> {
    const page = await UserModel.paginate({
      attributes: ['userId', 'username', 'nickname', 'email', 'status', 'createTime'],
      where: UserModel.buildQueryWhere(params),
      ...lodash.pick(params, ['itemsPerPage', 'page']),
    });

    return {
      ...page,
      items: page.items.map((i) => i.toJSON()),
    };
  }

  /**
   * Select user by id
   * @param id
   * @returns
   */
  public async selectUserById(id?: number): Promise<IUser> {
    const user = await UserModel.findOne({ where: { userId: id } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }

  /**
   * Select user profile.
   * @param id
   * @returns
   */
  public async selectProfile(id: number): Promise<IProfile> {
    const user = (
      await UserModel.findOne({
        where: { userId: id },
        include: [{ model: RoleModel }],
      })
    ).toJSON();

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const perms = await Promise.all(
      lodash.map(user.roles, async (role) => this.roleService.selectMenuPerms(role.roleId)),
    );

    return {
      ...lodash.omit(user, ['roles']),
      roles: lodash.map(user.roles, 'roleKey'),
      perms: lodash.chain(perms).flatten().map('perms').uniq().value(),
    };
  }

  /**
   * Get by Username.
   * @param username
   * @returns
   */
  public async getByUsername(username: string): Promise<IUser> {
    const user = await UserModel.findOne({ where: { username } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }

  /**
   * Get by Email.
   * @param email
   * @returns
   */
  public async getByEmail(email: string): Promise<IUser> {
    const user = await UserModel.findOne({ where: { email } });

    if (lodash.isEmpty(user)) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return user.toJSON();
  }

  /**
   * Create.
   * @param user
   * @returns
   */
  public async create(user: IUserCreate): Promise<IUser> {
    return UserModel.create(user);
  }

  /**
   * Update.
   * @param id
   * @param user
   * @returns
   */
  public async update(id: number, user: IUserUpdate): Promise<IUser> {
    const storedUser = await UserModel.findOne({ where: { userId: id } });

    storedUser.skipBcryptPassword = true;

    // update user.
    const updatedUser = await storedUser.update(user);

    return updatedUser;
  }

  /**
   * Reset password.
   * @param id
   * @param data
   * @returns
   */
  public async resetPassword(id: number, data: IPasswordReset): Promise<IUser> {
    if (data.password === '') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Password cannot be empty string, please set null or remove it if you want to keep the old password',
      );
    }

    const storedUser = await UserModel.findOne({ where: { userId: id } });

    if (!data.password || storedUser.getDataValue('password') === data.password) {
      storedUser.skipBcryptPassword = true;
    } else {
      storedUser.skipBcryptPassword = false;
    }

    return storedUser.update({ password: data.password });
  }

  /**
   * Delete.
   * @param id
   * @returns
   */
  public async delete(id: number): Promise<void> {
    if (await this.isAdmin(id)) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Cannot delete admin user!');
    }

    const requester = httpContext.get('user') as AuthorizedRequest['user'];

    if (id === requester.userId) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Cannot delete yourself!');
    }

    const storedUser = await UserModel.findOne({ where: { userId: id } });

    if (storedUser.getDataValue('deleted') === 9) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'User is not allow delete!');
    }

    return storedUser.destroy();
  }

  /**
   * Select user's roles.
   * @param userId
   * @returns
   */
  public async selectRolesWithUser(userId: number): Promise<IRoleWithUsers[]> {
    const roleAttrs = ['roleId', 'roleName', 'roleKey', 'orderNum', 'status', 'createTime'];
    const userAttrs = ['userId'];

    const roles = await RoleModel.findAll({
      attributes: roleAttrs,
      include: [
        {
          model: UserModel,
          attributes: userAttrs,
          where: { userId },
          required: false,
        },
      ],
    });

    return roles;
  }

  /**
   * Assign roles to user.
   * @param roleIds
   * @param userId
   * @param transaction
   * @returns
   */
  public async assignRolesToUser(
    roleIds: number[],
    userId: number,
    transaction?: Transaction,
  ): Promise<void> {
    if (lodash.isEmpty(roleIds)) return;

    // start transaction.
    const tac = transaction || (await RoleUserModel.sequelize.transaction());

    // role user associate.
    await RoleUserModel.bulkCreate(
      roleIds.map((roleId) => ({ roleId, userId })),
      { transaction: tac },
    );

    // update casbin.
    await CasbinModel.assignRolesToUser(roleIds, userId, tac);

    // commit transaction.
    await tac.commit();
  }

  /**
   * Unassign roles of user.
   * @param roleIds
   * @param userId
   * @param transaction
   * @returns
   */
  public async unassignRolesOfUser(
    roleIds: number[],
    userId: number,
    transaction?: Transaction,
  ): Promise<void> {
    if (lodash.isEmpty(roleIds)) return;

    // start transction.
    const tac = transaction || (await RoleUserModel.sequelize.transaction());

    // role user associate.
    await RoleUserModel.destroy({ where: { roleId: roleIds, userId }, transaction: tac });

    // update casbin.
    await CasbinModel.unassignRolesOfUser(roleIds, userId, tac);

    // commit transaction.
    await tac.commit();
  }

  /**
   * Is admin?
   * @param userId
   * @returns
   */
  public async isAdmin(userId?: number): Promise<boolean> {
    if (userId === 1) return true;
    const hasAdminRole = await RoleUserModel.findOne({ where: { userId, roleId: 1 } });
    return !!hasAdminRole;
  }

  /**
   * Valid password.
   * @param user
   * @param rawPassword
   * @returns
   */
  public validPassword(rawPassword: string, encodedPassword: string): boolean {
    return UserModel.validPassword(rawPassword, encodedPassword);
  }
}
