import { AppError } from '@nodite-light/admin-core';
import { SequelizePagination } from '@nodite-light/admin-database';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { Op } from 'sequelize';

import CasbinModel from '@/components/casbin/casbin.model';
import RoleModel, { IRole } from '@/components/role/role.model';
import { QueryParams } from '@/interfaces';

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
      throw new AppError(httpStatus.BAD_REQUEST, 'Create role failed!');
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

    if (lodash.isEmpty(storedRole)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role was not found!');
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
    // todo: check role is using, if using, not allow delete.

    const storedRole = await RoleModel.findOne({ where: { roleId: id } });

    if (lodash.isEmpty(storedRole)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role was not found!');
    }

    if (storedRole.getDataValue('deleted') === 9) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Role is not allow delete!');
    }

    return storedRole.destroy();
  }

  /**
   * Select menu list.
   * @param roleId
   * @returns
   */
  public async selectMenuList(roleId: number): Promise<string[]> {
    const menus = await CasbinModel.findAll({
      attributes: ['v1'],
      where: { ptype: 'p_role_menu', v0: roleId.toString() },
    });
    return menus.map((i) => i.getDataValue('v1'));
  }
}
