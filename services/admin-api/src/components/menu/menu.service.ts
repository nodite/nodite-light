import { AppError } from '@nodite-light/admin-core';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { arrayToTree } from 'performant-array-to-tree';

import { MenuTree } from '@/components/menu/menu.interface';
import MenuModel, { IMenu } from '@/components/menu/menu.model';
import RoleModel from '@/components/role/role.model';
import UserModel from '@/components/user/user.model';
import UserService from '@/components/user/user.service';

/**
 * Class MenuService.
 */
export default class MenuService {
  userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * selectMenuList
   * @param userId
   * @returns
   */
  public async selectMenuList(userId?: number): Promise<IMenu[]> {
    let menus: MenuModel[] = [];

    // admin.
    if (await this.userService.isAdmin(userId)) {
      menus = lodash.map(await MenuModel.findAll(), (m) => m.toJSON());
    }
    // no-admin user.
    else {
      // user.
      const user = await UserModel.findOne({
        where: { userId },
        include: [{ model: RoleModel, attributes: ['roleId'], required: false }],
      });

      // roles with menus.
      const roles = await RoleModel.findAll({
        where: {
          roleId: lodash.map(user?.getDataValue('roles'), 'roleId') || [],
        },
        include: [
          {
            model: MenuModel,
            required: false,
          },
        ],
      });

      menus = lodash
        .chain(roles)
        .map('menus')
        .flatten()
        .map((m) => m.toJSON())
        .uniqBy('menuId')
        .value();
    }

    // order
    return lodash.orderBy(menus, ['orderNum', 'menuId'], ['asc', 'asc']);
  }

  /**
   * selectMenuTree
   * @param userId
   * @returns
   */
  public async selectMenuTree(userId?: number): Promise<MenuTree[]> {
    const menus = await this.selectMenuList(userId);
    return this.buildMenuTree(menus);
  }

  /**
   * Select menu by id.
   * @param id
   * @returns
   */
  public async selectMenuById(id: number): Promise<IMenu> {
    const menu = await MenuModel.findOne({ where: { menuId: id } });
    return menu.toJSON<MenuModel>();
  }

  /**
   * create
   * @param menu
   * @returns
   */
  public async create(menu: IMenu): Promise<IMenu> {
    const createdMenu = await MenuModel.create({ ...menu });
    return createdMenu.toJSON<MenuModel>();
  }

  /**
   * Update menu.
   * @param id
   * @param menu
   * @returns
   */
  public async update(id: number, menu: IMenu): Promise<IMenu> {
    const storedMenu = await MenuModel.findOne({ where: { menuId: id } });
    const updatedUser = await storedMenu.update(menu);
    return updatedUser.toJSON<MenuModel>();
  }

  /**
   * Delete menu.
   * @param id
   */
  public async delete(id: number): Promise<void> {
    const storedMenu = await MenuModel.findOne({ where: { menuId: id } });

    if (storedMenu.getDataValue('deleted') === 9) {
      throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, 'Menu is not allow delete!');
    }

    return storedMenu.destroy();
  }

  /**
   * Build menu tree.
   * @param menus
   * @returns
   */
  protected buildMenuTree(menus: IMenu[]): MenuTree[] {
    const menuTree = arrayToTree(menus, {
      id: 'menuId',
      parentId: 'parentId',
      dataField: null,
      rootParentIds: lodash.reduce(
        lodash.difference(lodash.map(menus, 'parentId'), lodash.map(menus, 'menuId')),
        (result, value) => {
          return { ...result, [value]: true };
        },
        {},
      ),
      childrenField: 'children',
    }) as MenuTree[];

    this.setMenuLevel(menuTree);

    return menuTree;
  }

  /**
   * Set menu level.
   * @param menus
   * @param level
   * @returns
   */
  protected setMenuLevel(menus: MenuTree[], level: number = 0): MenuTree[] {
    menus.forEach((m) => {
      // eslint-disable-next-line no-param-reassign
      m.level = level;
      if (m.children) {
        this.setMenuLevel(m.children, level + 1);
      }
    });
    return menus;
  }
}
