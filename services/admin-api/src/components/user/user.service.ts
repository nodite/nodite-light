import { AuthorizedRequest } from '@nodite-light/admin-auth';
import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpContext from 'express-http-context';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op, Transaction } from 'sequelize';

import RoleService from '@/components/role/role.service';
import RoleUserModel, { IRoleWithUsers } from '@/components/role_user/role_user.model';
import { IPasswordReset, IUserCreate, IUserUpdate } from '@/components/user/user.interface';
import UserModel, { IUser } from '@/components/user/user.model';
import { QueryParams } from '@/interfaces';

import CasbinModel from '../casbin/casbin.model';
import RoleModel from '../role/role.model';

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
    const where = {};

    // queries.
    lodash.forEach(lodash.omit(params, ['itemsPerPage', 'page', 'sortBy']), (value, key) => {
      if (value) {
        lodash.set(where, key, { [Op.like]: `%${value}%` });
      }
    });

    const page = await UserModel.paginate({
      attributes: ['userId', 'username', 'nickname', 'email', 'status', 'createTime'],
      where,
      ...lodash.pick(params, ['itemsPerPage', 'page']),
    });

    return {
      ...page,
      items: page.items.map((i) => i.toJSON<UserModel>()),
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

    return user.toJSON<UserModel>();
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

    return user.toJSON<UserModel>();
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

    return user.toJSON<UserModel>();
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
    const transaction = await UserModel.sequelize.transaction();

    const storedUser = await UserModel.findOne({ where: { userId: id }, transaction });

    storedUser.skipBcryptPassword = true;

    // update user.
    const updatedUser = await storedUser.update(user, { transaction });

    // commit transaction.
    await transaction.commit();

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
    const roleAttrs = ['roleId', 'roleName', 'roleKey', 'orderNum', 'iKey', 'status', 'createTime'];
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
