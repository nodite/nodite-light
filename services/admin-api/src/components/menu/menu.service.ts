import { IMenu, MenuTree } from '@components/menu/_iac/menu.interface';
import { MenuModel } from '@components/menu/menu.model';
import { UserService } from '@components/user/user.service';
import lodash from 'lodash';
import { arrayToTree } from 'performant-array-to-tree';
import { Attributes, FindOptions } from 'sequelize';

/**
 * Class MenuService.
 */
export class MenuService {
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
   * create
   * @param menu
   * @returns
   */
  public async create(menu: IMenu): Promise<MenuModel> {
    return MenuModel.create({ ...menu });
  }

  /**
   * buildMenuTree.
   * @param menus
   * @returns
   */
  protected buildMenuTree(menus: IMenu[]): MenuTree[] {
    return arrayToTree(menus, {
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
  }
}

export default {};
