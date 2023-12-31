import { AppError } from '@nodite-light/admin-core';
import httpStatus from 'http-status';
import lodash from 'lodash';
import { arrayToTree } from 'performant-array-to-tree';
import { Attributes, FindOptions } from 'sequelize';

import { IMenu, MenuTree } from '@/components/menu/menu.interface';
import MenuModel from '@/components/menu/menu.model';
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
    const options = {
      order: [
        ['orderNum', 'ASC'],
        ['menuId', 'ASC'],
      ],
    } as FindOptions<Attributes<MenuModel>>;

    const menus = await (this.userService.isAdmin(userId)
      ? MenuModel.findAll(options)
      : MenuModel.findAllByUserId(userId, options));

    return menus.map((m) => m.toJSON<IMenu>());
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

    if (lodash.isEmpty(menu)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Menu was not found!');
    }

    return menu.toJSON<IMenu>();
  }

  /**
   * create
   * @param menu
   * @returns
   */
  public async create(menu: IMenu): Promise<IMenu> {
    const createdMenu = await MenuModel.create({ ...menu });
    return createdMenu.toJSON<IMenu>();
  }

  /**
   * Update menu.
   * @param id
   * @param menu
   * @returns
   */
  public async update(id: number, menu: IMenu): Promise<IMenu> {
    const storedMenu = await MenuModel.findOne({ where: { menuId: id } });

    if (lodash.isEmpty(storedMenu)) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Menu was not found!');
    }

    const updatedUser = await storedMenu.update(menu);

    return updatedUser.toJSON<IMenu>();
  }

  /**
   * Delete menu.
   * @param id
   */
  public async delete(id: number): Promise<void> {
    const storedMenu = await MenuModel.findOne({ where: { menuId: id } });

    if (storedMenu.getDataValue('deleted') === 9) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Menu is not allow delete!');
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
