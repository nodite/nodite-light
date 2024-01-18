import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op, Transaction } from 'sequelize';

import CasbinModel from '@/components/casbin/casbin.model';
import MenuModel, { IMenu } from '@/components/menu/menu.model';
import RoleModel, { IRole } from '@/components/role/role.model';
import RoleMenuModel from '@/components/role_menu/role_menu.model';
import RoleUserModel, { IUserWithRoles } from '@/components/role_user/role_user.model';
import UserModel from '@/components/user/user.model';
import { QueryParams } from '@/interfaces';

/**
 * Class RoleService.
 */
export default class RoleService {
  /**
   * Search roles.
   * @param params
   * @returns
   */
  public async selectRoleList(params?: QueryParams): Promise<SequelizePagination<IRole>> {
    const where = {};

    // queries.
    lodash.forEach(lodash.omit(params, ['itemsPerPage', 'page', 'sortBy']), (value, key) => {
      if (value) {
        lodash.set(where, key, { [Op.like]: `%${value}%` });
      }
    });

    const page = await RoleModel.paginate({
      attributes: ['roleId', 'roleName', 'roleKey', 'orderNum', 'iKey', 'status', 'createTime'],
      where,
      ...lodash.pick(params, ['itemsPerPage', 'page']),
    });

    return {
      ...page,
      items: page.items.map((i) => i.toJSON<RoleModel>()),
    };
  }

  /**
   * Select role by id.
   * @param id
   * @returns
   */
  public async selectRoleById(id: number): Promise<IRole> {
    const role = await RoleModel.findOne({ where: { roleId: id } });

    if (lodash.isEmpty(role)) {
      throw new AppError(httpStatus.NOT_FOUND, 'Role not found');
    }

    return role.toJSON<RoleModel>();
  }

  /**
   * Create role.
   * @param role
   * @returns
   */
  public async create(role: IRole): Promise<IRole> {
    const roleInstance = await RoleModel.create({ ...role });
    if (lodash.isEmpty(roleInstance)) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Create role failed!');
    }
    return roleInstance.toJSON<RoleModel>();
  }

  /**
   * Update role.
   * @param role
   * @returns
   */
  public async update(id: number, role: IRole): Promise<IRole> {
    const storedRole = await RoleModel.findOne({ where: { roleId: id } });

    if (id === 1 && !!role.roleKey && role.roleKey !== storedRole.roleKey) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'roleKey is not allow update for admin!');
    }

    const updatedRole = await storedRole.update(role);

    return updatedRole.toJSON<RoleModel>();
  }

  /**
   * Delete role.
   * @param id
   * @returns
   */
  public async delete(id: number): Promise<void> {
    if (id === 1) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Admin role is not allow delete!');
    }

    if (await RoleUserModel.findOne({ where: { roleId: id } })) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Role is using, please unassign first!');
    }

    const storedRole = await RoleModel.findOne({ where: { roleId: id } });

    if (lodash.isEmpty(storedRole)) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Role was not found!');
    }

    if (storedRole.getDataValue('deleted') === 9) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Role is not allow delete!');
    }

    return storedRole.destroy();
  }

  /**
   * Select menu list.
   * @param roleId
   * @returns
   */
  public async selectMenuPerms(roleId: number): Promise<Pick<IMenu, 'menuId' | 'perms'>[]> {
    if (await RoleMenuModel.hasFullPerms(roleId)) {
      return [{ menuId: 0, perms: '*:*:*' }];
    }

    const role = await RoleModel.findOne({
      attributes: [],
      where: { roleId },
      include: [
        {
          model: MenuModel,
          attributes: ['menuId', 'perms'],
          through: { attributes: [] },
        },
      ],
    });

    return role.menus;
  }

  /**
   * Save menu perms.
   * @param roleId
   * @param menuIds
   */
  public async updateMenuPerms(roleId: number, menuIds: number[]): Promise<void> {
    if (roleId === 1) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Role is not allow update!');
    }

    // start transaction.
    const transaction = await RoleMenuModel.sequelize.transaction();

    // role menu associate.
    await RoleMenuModel.destroy({ where: { roleId }, transaction });

    await RoleMenuModel.bulkCreate(
      menuIds.map((menuId) => ({ roleId, menuId })),
      { transaction },
    );

    // update casbin.
    await CasbinModel.removeRolePolicies(roleId, transaction);

    if (!lodash.isEmpty(menuIds)) {
      const menuPerms = menuIds.includes(0)
        ? ['*:*:*']
        : lodash
            .chain(
              await MenuModel.findAll({
                attributes: ['perms'],
                where: { menuId: menuIds },
                transaction,
              }),
            )
            .map('perms')
            .filter()
            .value();

      await CasbinModel.addRolePolicies(roleId, menuPerms, transaction);
    }

    // commit transaction.
    await transaction.commit();
  }

  /**
   * Select role's users.
   * @param roleId
   * @returns
   */
  public async selectUsersWithRole(roleId: number): Promise<IUserWithRoles[]> {
    const userAttrs = ['userId', 'username', 'nickname', 'email', 'status', 'createTime'];
    const roleAttrs = ['roleId'];

    const users = await UserModel.findAll({
      attributes: userAttrs,
      include: [
        {
          model: RoleModel,
          attributes: roleAttrs,
          where: { roleId },
          required: false,
        },
      ],
    });

    return users;
  }

  /**
   * Assign role to users.
   * @param roleId
   * @param userIds
   */
  public async assignRoleToUsers(
    roleId: number,
    userIds: number[],
    transaction?: Transaction,
  ): Promise<void> {
    if (lodash.isEmpty(userIds)) return;

    // start transaction.
    const tac = transaction || (await RoleUserModel.sequelize.transaction());

    // role user associate.
    await RoleUserModel.bulkCreate(
      userIds.map((userId) => ({ roleId, userId })),
      { transaction: tac },
    );

    // update casbin.
    await Promise.all(
      userIds.map((userId) => CasbinModel.assignRolesToUser([roleId], userId, tac)),
    );

    // commit transaction.
    await tac.commit();
  }

  /**
   * Unassign role of users.
   * @param roleId
   * @param userIds
   */
  public async unassignRoleOfUsers(
    roleId: number,
    userIds: number[],
    transaction?: Transaction,
  ): Promise<void> {
    if (lodash.isEmpty(userIds)) return;

    // start transaction.
    const tac = transaction || (await RoleUserModel.sequelize.transaction());

    // role user associate.
    await RoleUserModel.destroy({ where: { roleId, userId: userIds }, transaction: tac });

    // update casbin.
    await Promise.all(
      userIds.map((userId) => CasbinModel.unassignRolesOfUser([roleId], userId, tac)),
    );

    // commit transaction.
    await tac.commit();
  }
}
